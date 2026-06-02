import { Global, Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { PaymentClientGrpc } from './payment.grpc';
import { PROTO_PATHS } from "@mirocinema/contracts"
import { GrpcModule } from '@mirocinema/common';


@Global()
@Module({
  imports: [
    GrpcModule.register(['PAYMENT_PACKAGE', 'REFUND_PACKAGE'])
  ],
  controllers: [PaymentController],
  providers: [PaymentClientGrpc],
  exports: [PaymentClientGrpc]
})
export class PaymentModule {}
