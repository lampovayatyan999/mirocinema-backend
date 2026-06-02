import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common"
import { AccountClientGrpc } from "./account.grpc"
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger"
import { ConfirmEmailChangeRequest, ConfirmPhoneChangeRequest, InitEmailChangeRequest, InitPhoneChangeRequest } from "./dto"
import { CurrentUser, Protected } from "src/shared/decorators"


@Controller('account')
export class AccountController {
  public constructor(private readonly client: AccountClientGrpc) {}

  @ApiOperation({
    summary: 'Init email change',
    description: 'Sends confirmation code to new email address.'
  })
  @ApiBearerAuth()
  @Protected()
  @Post('email/init')
  @HttpCode(HttpStatus.OK)
  public async initEmailChange(@Body() dto: InitEmailChangeRequest, @CurrentUser() userId: string) {
    return this.client.call('initEmailChange', {
        ...dto,
        userId
    })
  }

  
  @ApiOperation({
    summary: 'Confirm email change',
    description: 'Verifies confirmation code and updates user email.'
  })
  @ApiBearerAuth()
  @Protected()
  @Post('email/confirm')
  @HttpCode(HttpStatus.OK)
  public async confirmEmailChange(@Body() dto: ConfirmEmailChangeRequest, @CurrentUser() userId: string) {
    return this.client.call('confirmEmailChange', {
        ...dto,
        userId
    })
  }


@ApiOperation({
    summary: 'Init phone change',
    description: 'Sends confirmation code to new phone address.'
  })
  @ApiBearerAuth()
  @Protected()
  @Post('phone/init')
  @HttpCode(HttpStatus.OK)
  public async initPhoneChange(@Body() dto: InitPhoneChangeRequest, @CurrentUser() userId: string) {
    return this.client.call('initPhoneChange', {
        ...dto,
        userId
    })
  }

  
  @ApiOperation({
    summary: 'Confirm phone change',
    description: 'Verifies confirmation code and updates user phone.'
  })
  @ApiBearerAuth()
  @Protected()
  @Post('phone/confirm')
  @HttpCode(HttpStatus.OK)
  public async confirmPhoneChange(@Body() dto: ConfirmPhoneChangeRequest, @CurrentUser() userId: string) {
    return this.client.call('confirmPhoneChange', {
        ...dto,
        userId
    })
  }
}