import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { SendOtpRequest, VerifyOtpRequest } from './dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthClientGrpc } from './auth.grpc';
import type { Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { CurrentUser, Protected } from 'src/shared/decorators';

@Controller('auth')
export class AuthController {
  public constructor(private readonly client: AuthClientGrpc, private readonly configService: ConfigService) {}

  @ApiOperation({
    summary: 'Send otp code',
    description: 'Sends a verfication code to the user phone number or email.'
  })
  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  public async sendOtp(@Body() dto: SendOtpRequest) {
    return this.client.call('sendOtp', dto)
  }


  @ApiOperation({
    summary: 'Verify otp code',
    description: 'Verifies the code to the user phone number or email and returns a acess token'
  })
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  public async verifyOtp(@Body() dto: VerifyOtpRequest, @Res({ passthrough: true }) res: Response) {
    const {accessToken, refreshToken} = await this.client.call('verifyOtp', dto)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.getOrThrow<string>('NODE_ENV') !== 'development',
      domain: this.configService.getOrThrow<string>('COOKIES_DOMAIN'),
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    })

    return { accessToken }
  }

  @ApiOperation({summary: 'Refresh access token', description: 'Renews access token using refresh token from cookies' })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refresh(@Req() req: Request, @Res({passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken

    const {accessToken, refreshToken: newRefreshToken} = await this.client.call('refresh', { refreshToken })

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: this.configService.getOrThrow<string>('NODE_ENV') !== 'development',
      domain: this.configService.getOrThrow<string>('COOKIES_DOMAIN'),
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    })

    return { accessToken }
  }

  @ApiOperation({
    summary: 'Logout',
    description: 'Clears the refresh token cookie and logs the user out'
  })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') !== 'development',
      domain: this.configService.getOrThrow<string>('COOKIES_DOMAIN'),
      sameSite: 'lax',
      expires: new Date(0)
    })

    return {ok: true}
  }

  @ApiBearerAuth()
  @Protected()
  @Get('account')
  public async getAccount(@CurrentUser() userId: string) {
    return { id: userId }
  }
}
