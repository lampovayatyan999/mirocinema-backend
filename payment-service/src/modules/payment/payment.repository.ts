import { Injectable } from "@nestjs/common";
import { PaymentMethodStatus, PaymentStatus } from "@prisma/generated/enums";
import type { PaymentCreateInput, PaymentMethodCreateInput, PaymentMethodUpdateInput, PaymentUpdateInput } from "prisma/generated/models";
import { PrismaService } from "src/infra/prisma/prisma.service";

@Injectable()
export class PaymentRepository {
    public constructor(private readonly prismaService: PrismaService) {}

    public findPaymentById(id: string) {
        return this.prismaService.payment.findUnique({
            where: {
                id
            }
        })
    }

    public createPayment(data: PaymentCreateInput) {
        return this.prismaService.payment.create({ data })
    }

    public updatePayment(id: string, data: PaymentUpdateInput) {
        return this.prismaService.payment.update({
            where: {
                id
            },
            data
        })
    }

    public markPaymentSuccess(id: string) {
        return this.prismaService.payment.update({
            where: {
                id
            },
            data: {
                status: PaymentStatus.SUCESS
            }
        })
    }

    public markPaymentFailed(id: string) {
        return this.prismaService.payment.update({
            where: {
                id
            },
            data: {
                status: PaymentStatus.FAILED
            }
        })
    }

    public findUserPaymentMethod(userId: string) {
        return this.prismaService.paymentMethod.findMany({
            where: {
                userId,
                status: PaymentMethodStatus.ACTIVE
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }

    public findPaymentMethodById(id: string) {
        return this.prismaService.paymentMethod.findUnique({
            where: {
                id
            }
        })
    }

    public findActivePaymentMethod(userId: string, providerId: string) {
        return this.prismaService.paymentMethod.findFirst({
            where: {
                userId,
                providerId,
                status: PaymentMethodStatus.ACTIVE
            }
        })
    }

    public createPaymentMethod(data: PaymentMethodCreateInput) {
        return this.prismaService.paymentMethod.create({ data })
    }

    public updatePaymentMethod(id: string, data: PaymentMethodUpdateInput) {
        return this.prismaService.paymentMethod.update({
            where: {
                id
            },
            data
        })
    }

    public deletePaymentMethod(id: string) {
        return this.prismaService.paymentMethod.delete({
            where: {
                id
            }
        })
    }
}