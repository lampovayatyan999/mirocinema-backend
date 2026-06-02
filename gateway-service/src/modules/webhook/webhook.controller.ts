import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { PaymentClientGrpc } from "../payment/payment.grpc";
import { RefundClientGrpc } from "../refund/refund.grpc";

@Controller('webhook')
export class WebhookController {

    public constructor(private readonly paymentClient: PaymentClientGrpc, private readonly refundClient: RefundClientGrpc) {}

    @Post('stripe')
    @HttpCode(HttpStatus.OK)
    public async handleStripe(@Body() raw: any) {
        const event = raw.event
        const data = raw.object

        const card = data.payment_method?.card

        if(event.startsWith('payment.')) {
            await this.paymentClient.call('processPaymentEvent', {
                event,
                paymentId: data.metadata.payment_id,
                bookingId: data.metadata.booking_id,
                userId: data.metadata.user_id,
                savePaymentMethod: data.payment_method?.saved ?? false,
                providerMethodId: data.payment_method?.id ?? '',
                cardFirst6: card?.first6 ?? '',
                cardLast4: card?.last4 ?? '',
                bank: card?.card_product?.name ?? 'Unknown',
                brand: card?.card_type ?? 'Unknown',
            })
        }

        if(event.startsWith('refund')) {
            await this.refundClient.call('processRefundEvent', {
                event,
                providerRefundId: data.id,
                status: data.status
            })
        }
    }
}