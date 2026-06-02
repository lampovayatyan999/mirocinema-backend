import { Injectable, Inject } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentRepository } from './payment.repository';
import type { CreatePaymentRequest, ProcessPaymentEventRequest, GetUserPaymentMethodsRequest, CreatePaymentMethodRequest, VerifyPaymentMethodRequest, DeletePaymentMethodRequest } from "@mirocinema/contracts/gen/ts/payment"
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import {RpcStatus} from '@mirocinema/common'
import { PaymentMethod, PaymentMethodStatus } from '@prisma/generated/client';
import { BookingClientGrpc } from '@/clients/booking.client';
import { lastValueFrom } from 'rxjs';
export const STRIPE_TOKEN = 'STRIPE_TOKEN';

@Injectable()
export class PaymentService {
    private readonly HOSTS_APP: string

    public constructor(
        private readonly repository: PaymentRepository,
        private readonly configService: ConfigService,
        @Inject(STRIPE_TOKEN) private readonly stripeService: Stripe,
        private readonly bookingClient: BookingClientGrpc
    ) {
        this.HOSTS_APP = this.configService.getOrThrow<string>('HOSTS_APP')
    }

    public async createPayment(data: CreatePaymentRequest) {
        const {
            userId,
            screeningId,
            seats,
            paymentMethodId,
            savePaymentMethod
        } = data

        const reservation = await lastValueFrom(this.bookingClient.createReservation({
            userId,
            screeningId,
            seats
        }))

        const transaction = await this.repository.createPayment({
            amount: reservation.amount,
            userId,
            bookingId: reservation.orderId
        })

        let paymentMethod: PaymentMethod | null = null
        
        
        if(paymentMethodId) {
            paymentMethod = await this.repository.findPaymentMethodById(paymentMethodId)

            if(!paymentMethod) throw new RpcException({
                code: RpcStatus.NOT_FOUND,
                details: 'Saved payment method not found'
            })
        }

        const session = await this.stripeService.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: seats.map(seat => ({
                price_data: {
                    currency: 'usd',
                    unit_amount: seat.price * 100,
                    product_data: {
                        name: `Ticket for screening ${screeningId}`,
                    },
                },
                quantity: 1,
            })),
            mode: 'payment',
            payment_intent_data: {
                setup_future_usage: savePaymentMethod ? 'off_session' : undefined,
                ...(paymentMethodId
                    ? { payment_method: paymentMethod!.providerId! }
                    : {}
                ),
            },
            success_url: `${this.HOSTS_APP}/account/tickets/callback`,
            cancel_url: `${this.HOSTS_APP}/account/tickets`,
            metadata: {
                payment_id: transaction.id,
                booking_id: reservation.orderId,
                user_id: userId,
            },
        })

        await this.repository.updatePayment(transaction.id, {
            providerId: session.id,
            metadata: JSON.stringify(session)
        })

        return { url: session.url ?? `${this.HOSTS_APP}/account/tickets/callback` }
    }

    public async processEvent(data: ProcessPaymentEventRequest) {
        const { paymentId, bookingId, userId, event, savePaymentMethod, providerMethodId, cardFirst6, cardLast4 } = data

        const payment = await this.repository.findPaymentById(paymentId)

        if(!payment) throw new RpcException({
            code: RpcStatus.NOT_FOUND,
            details: 'Payment not found'
        })

        if(event === 'payment.waiting_for_capture') {
            try {
                const session = await this.stripeService.checkout.sessions.retrieve(payment.providerId!)
                await this.stripeService.paymentIntents.capture(session.payment_intent as string)
            } catch (error) {
                throw new RpcException({
                    code: RpcStatus.INTERNAL,
                    details: 'Failed to capture payment'
                })
            }
        }

        if(event === 'payment.succeded') {
            await this.repository.markPaymentSuccess(payment.id)

            if(savePaymentMethod && providerMethodId) {
                const existing = await this.repository.findActivePaymentMethod(userId, providerMethodId)

                if(existing) return { ok: true }

                try {
                    await this.repository.createPaymentMethod({
                    type: 'BANK_CARD',
                    providerId: providerMethodId,
                    userId,
                    status: PaymentMethodStatus.ACTIVE,
                    first6: cardFirst6,
                    last4: cardLast4,
                })
                } catch (error) {
                    console.log(`Failed to save payment method for user ${userId}`, error)
                }
            }

            try {
                await lastValueFrom(
                    this.bookingClient.confirmBooking({
                        bookingId,
                        userId
                    })
                )
            } catch (error) {
                console.error('Failed to call booking.confirmBooking: ', error)

                throw error 
            }
        }

        if(event === 'payment.cancelled') {
            await this.repository.markPaymentFailed(payment.id)
        }

        return {ok: true}
    }

    public async getUserPaymentMetthods(data: GetUserPaymentMethodsRequest) {
        const {userId} = data

        const methods = await this.repository.findUserPaymentMethod(userId)

        return { methods }
    }

    public async createPaymentMethod(data: CreatePaymentMethodRequest) {
        const { userId } = data

        const method = await this.repository.createPaymentMethod({
            type: 'BANK_CARD',
            userId
        })

        const setupIntent = await this.stripeService.setupIntents.create({
            usage: 'off_session',
            metadata: {
                payment_method_id: method.id,
                user_id: userId
            }
        })

        await this.repository.updatePaymentMethod(method.id, {
            providerId: setupIntent.id
        })

        const url = `${this.HOSTS_APP}/account/payment-methods/callback?payment_method_id=${method.id}&client_secret=${setupIntent.client_secret}`

        return { id: method.id, url }
    }

    public async verifyPaymentMethod(data: VerifyPaymentMethodRequest) {
        const { methodId, userId } = data

        const method = await this.repository.findPaymentMethodById(methodId)

        if(!method || method.userId !== userId) throw new RpcException({
            code: RpcStatus.NOT_FOUND,
            details: 'Payment method not found'
        })

        const setupIntent = await this.stripeService.setupIntents.retrieve(method.providerId!)

        if(setupIntent.status !== 'succeeded') throw new RpcException({
            code: RpcStatus.FAILED_PRECONDITION,
            details: 'Payment method is not active or was not saved'
        })

        const stripePaymentMethod = await this.stripeService.paymentMethods.retrieve(
            setupIntent.payment_method as string
        )

        const card = stripePaymentMethod.card

        await this.repository.updatePaymentMethod(method.id, {
            status: PaymentMethodStatus.ACTIVE,
            providerId: stripePaymentMethod.id,
            last4: card?.last4,
            brand: card?.brand ?? 'Unknown',
        })

        return { ok: true }
    }

    public async deletePaymentMethod(data: DeletePaymentMethodRequest) {
        const { methodId, userId} = data

        const method = await this.repository.findPaymentMethodById(methodId)

        if(!method || method.userId !== userId) 
            throw new RpcException({
                code: RpcStatus.NOT_FOUND,
                details: 'Payment method not found'
            })

        await this.repository.deletePaymentMethod(method.id)

        return {ok: true}
    }
}