import { Global, Module } from '@nestjs/common';
import { RefundClientGrpc } from './refund.grpc';
import { GrpcModule } from '@mirocinema/common';
import { RefundController } from './refund.controller';


@Global()
@Module({
  imports: [
    GrpcModule.register(['REFUND_PACKAGE'])
  ],
  controllers: [RefundController],
  providers: [RefundClientGrpc],
  exports: [RefundClientGrpc]
})
export class RefundModule {}
