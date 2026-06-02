import { PrismaService } from '@/infra/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PaymentStatus, RefundStatus } from '@prisma/generated/enums';
import { 
  RefundCreateInput, 
  RefundUpdateInput 
} from '@prisma/generated/models';

@Injectable()
export class RefundRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public findRefundByProviderId(providerId: string) {
    return this.prismaService.refund.findFirst({
      where: {
        providerId
      },
      include: {
        payment: true
      }
    });
  }

  public fundPaymentByBookingId(bookingId: string) {
    return this.prismaService.payment.findFirst({
      where: {
        bookingId
      } 
    })
  }

  public createRefund(data: RefundCreateInput) {
    return this.prismaService.refund.create({
      data
    });
  }

  public updateRefund(id: string, data: RefundUpdateInput) {
    return this.prismaService.refund.update({
      where: {
        id
      },
      data
    });
  }

  public markRefundSuccess(id: string) {
    return this.prismaService.refund.update({
      where: {
        id
      },
      data: {
        status: RefundStatus.SUCCESS
      }
    });
  }

  public markPaymentRefunded(paymentId: string) {
    return this.prismaService.payment.update({
      where: {
        id: paymentId
      },
      data: {
        status: PaymentStatus.REFUNDED
      }
    });
  }
}