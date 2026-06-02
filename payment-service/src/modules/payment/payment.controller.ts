import { Controller } from '@nestjs/common';
import { PaymentService } from './payment.service';
import type { CreatePaymentMethodRequest, CreatePaymentRequest, CreatePaymentResponse, DeletePaymentMethodRequest, GetUserPaymentMethodsRequest, ProcessPaymentEventRequest, ProcessPaymentEventResponse, VerifyPaymentMethodRequest } from '@mirocinema/contracts/gen/ts/payment';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class PaymentController {
    public constructor(private readonly paymentService: PaymentService) {}

    @GrpcMethod('PaymentService', 'CreatePayment')
    public async createPayment(data: CreatePaymentRequest): Promise<CreatePaymentResponse> {
        return this.paymentService.createPayment(data)
    }

    @GrpcMethod('PaymentService', 'ProcessPaymentEvent')
    public async processEvent(data: ProcessPaymentEventRequest): Promise<ProcessPaymentEventResponse> {
        return this.paymentService.processEvent(data)
    }

    @GrpcMethod('PaymentService', 'GetUserPaymentMethods')
    public async getUserPaymentMethods(data: GetUserPaymentMethodsRequest) {
        return await this.paymentService.getUserPaymentMetthods(data)
    }

    @GrpcMethod('PaymentService', 'CreatePaymentMethod')
    public async createPaymentMethod(data: CreatePaymentMethodRequest) {
        return await this.paymentService.createPaymentMethod(data)
    }

    @GrpcMethod('PaymentService', 'VerifyPaymentMethod')
    public async verifyPaymentMethod(data: VerifyPaymentMethodRequest) {
        return await this.paymentService.verifyPaymentMethod(data)
    }

    @GrpcMethod('PaymentService', 'DeletePaymentMethod')
    public async deletePaymentMethod(data: DeletePaymentMethodRequest) {
        return await this.paymentService.deletePaymentMethod(data)
    }
}