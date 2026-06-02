import { Module } from '@nestjs/common';
import { RefundService } from './refund.service';
import { RefundController } from './refund.controller';
import { RefundRepository } from './refund.repository';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [PaymentModule],
  controllers: [RefundController],
  providers: [RefundService, RefundRepository],
})
export class RefundModule {}
