import { Injectable, Inject } from '@nestjs/common';
import { RefundRepository } from './refund.repository';
import Stripe from 'stripe';
import { RpcException } from '@nestjs/microservices';
import { RpcStatus } from '@mirocinema/common';
import type { CreateRefundRequest, ProcessRefundEventRequest } from '@mirocinema/contracts/gen/ts/refund';
import { STRIPE_TOKEN } from '../payment/payment.service';
import { BookingClientGrpc } from '@/clients/booking.client';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RefundService {
    public constructor(
        private readonly repository: RefundRepository,
        @Inject(STRIPE_TOKEN) private readonly stripeService: Stripe,
        private readonly bookingClient: BookingClientGrpc
    ) {}

    public async createRefund(data: CreateRefundRequest) { 
        const { userId, bookingId } = data
        
        const payment = await this.repository.fundPaymentByBookingId(bookingId)

        if(!payment || payment.userId !== userId) throw new RpcException({
            code: RpcStatus.NOT_FOUND,
            details: 'Payment not found'
        })

        const refund = await this.repository.createRefund({
            amount: payment.amount,
            payment: {
                connect: {
                    id: payment.id
                }
            }
        })

        const stripe = await this.stripeService.refunds.create({
            amount: Math.round(payment.amount * 100),
            payment_intent: payment.providerId!
        })

        await this.repository.updateRefund(refund.id, {
            providerId: stripe.id
        })

        return { ok: true }
    }

    public async processEvent(data: ProcessRefundEventRequest) {
        const {event, providerRefundId, status} = data

        const refund = await this.repository.findRefundByProviderId(providerRefundId)

        if(!refund) throw new RpcException({
            code: RpcStatus.NOT_FOUND,
            details: 'Refund not found'
        })

        if(event === 'refund.succeeded') {
            try {
                await this.repository.markRefundSuccess(refund.id)
                await this.repository.markPaymentRefunded(refund.paymentId)

                await lastValueFrom(this.bookingClient.cancelBooking({
                    bookingId: refund.payment.bookingId,
                    userId: refund.payment.userId
                }))
                
                return { ok: true }
            } catch (error) {
                throw new RpcException({
                    code: RpcStatus.INTERNAL,
                    details: 'Failed to process refund'
                })
            }
        }
    }
}