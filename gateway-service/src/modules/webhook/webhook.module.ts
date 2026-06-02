import { Module } from "@nestjs/common";
import { WebhookController } from "./webhook.controller";
import { GrpcModule } from "@mirocinema/common";
import { PaymentClientGrpc } from "../payment/payment.grpc";
import { RefundClientGrpc } from "../refund/refund.grpc";


@Module({
    imports: [GrpcModule.register(['PAYMENT_PACKAGE', 'REFUND_PACKAGE'])],
    controllers: [WebhookController],
    providers: [PaymentClientGrpc, RefundClientGrpc]
})
export class WebhookModule {}