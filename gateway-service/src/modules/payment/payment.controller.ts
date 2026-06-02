import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common"
import { PaymentClientGrpc } from "./payment.grpc"
import { ApiBearerAuth } from "@nestjs/swagger"
import { CurrentUser, Protected } from "src/shared/decorators"
import { InitPaymentRequest } from "./dto"


@Controller('payment')
export class PaymentController {
  public constructor(private readonly payment: PaymentClientGrpc) {}

  @ApiBearerAuth()
  @Protected()
  @Post('init')
  @HttpCode(HttpStatus.OK)
  public async initEmailChange(@Body() dto: InitPaymentRequest, @CurrentUser() userId: string) {
    return this.payment.call('createPayment', {
      ...dto,
      userId,
      savePaymentMethod: dto.savePaymentMethod ?? false,
    })
  }


  @ApiBearerAuth()
  @Protected()
  @Get('methods')
  @HttpCode(HttpStatus.OK)
  public async getPaymentMethods(@CurrentUser() userId: string) {
    const response = await this.payment.call('getUserPaymentMethods', {
      userId
    });

    return Array.isArray(response.methods) ? response.methods : [];
  }


  @ApiBearerAuth()
  @Protected()
  @Post('methods')
  public async createPaymentMethod(@CurrentUser() userId: string) {
    return await this.payment.call('createPaymentMethod', { userId });
  }

  @ApiBearerAuth()
  @Protected()
  @Post('methods/verify')
  public async verifyPaymentMethod(
    @CurrentUser() userId: string,
    @Query('payment_method_id') methodId: string, 
  ) {
    return await this.payment.call('verifyPaymentMethod', {
      methodId,
      userId
    });
  }

  @ApiBearerAuth()
  @Protected()
  @Delete('methods/:id')
  public async deletePaymentMethod(
    @CurrentUser() userId: string,
    @Param('id') methodId: string, 
  ) {
    return await this.payment.call('deletePaymentMethod', {
      methodId,
      userId
    });
  }
}