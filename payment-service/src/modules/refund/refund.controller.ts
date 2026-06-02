import { Controller } from '@nestjs/common';
import { RefundService } from './refund.service';
import { GrpcMethod } from '@nestjs/microservices';
import type { CreateRefundRequest, CreateRefundResponse, ProcessRefundEventRequest, ProcessRefundEventResponse } from '@mirocinema/contracts/gen/ts/refund';

@Controller()
export class RefundController {
    public constructor(private readonly refundService: RefundService) {}

    @GrpcMethod('RefundService', 'CreateRefund')
    public async createRefund(data: CreateRefundRequest) {
        return this.refundService.createRefund(data)
    }

    @GrpcMethod('RefundService', 'ProcessRefundEvent')
    public async processEvent(data: ProcessRefundEventRequest) {
        return this.refundService.processEvent(data)
    }
}