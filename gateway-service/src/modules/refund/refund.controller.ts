import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { CurrentUser, Protected } from 'src/shared/decorators'

import { RefundClientGrpc } from './refund.grpc'
import { CreateRefundRequest } from './dto'
import { ApiBearerAuth } from '@nestjs/swagger'

@Controller('refunds')
export class RefundController {
  public constructor(private readonly refund: RefundClientGrpc) {}

  @ApiBearerAuth()
  @Protected()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public createRefund(
    @Body() dto: CreateRefundRequest,
    @CurrentUser() userId: string
  ) {
    return this.refund.call('createRefund', {
      userId,
      ...dto
    })
  }
}