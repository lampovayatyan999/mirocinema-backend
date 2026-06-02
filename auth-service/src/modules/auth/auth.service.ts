import type { RefreshRequest, SendOtpRequest, VerifyOtpRequest } from '@mirocinema/contracts/gen/ts/auth';
import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { Account } from '@prisma/generated/client';
import { OtpService } from '../otp/otp.service';
import { RpcException } from '@nestjs/microservices';
import { PassportService, TokenPayload } from '@mirocinema/passport';
import { ConfigService } from '@nestjs/config';
import type { AllConfigs } from '@/config';
import { UserRepository } from '@/shared/repositories';
import { MessagingService } from '@/infrastructure/messaging/messaging.service';
import { UsersClientGrpc } from '../users/users.grpc';
import { RpcStatus } from '@mirocinema/common/dist';
import { PinoLogger } from 'nestjs-pino';


@Injectable()
export class AuthService {
    private readonly ACCESS_TOKEN_TTL: number
    private readonly REFRESH_TOKEN_TTL: number

    public constructor( private readonly logger: PinoLogger, private readonly configService: ConfigService<AllConfigs>, private readonly authRepository: AuthRepository, private readonly userRepository: UserRepository, private readonly otpService: OtpService, private readonly passportService: PassportService, private readonly messagingService: MessagingService, private readonly usersClient: UsersClientGrpc) {
        this.ACCESS_TOKEN_TTL = this.configService.get('passport.accessTtl', {infer: true})

        this.REFRESH_TOKEN_TTL = this.configService.get('passport.refreshTtl', {infer: true})
        this.logger.setContext(AuthService.name)
    }

    public async sendOtp(data: SendOtpRequest) {
        const { identifier, type } = data

        this.logger.info(
            `OTP request received: identifier=${identifier}, type=${type}`
        )

        let account: Account | null

        if(type === 'phone') 
            account = await this.userRepository.findByPhone(identifier)
        else account = await this.userRepository.findByEmail(identifier)

        if(!account) {
            this.logger.info(
                `Account not found, creating new account for: identifier=${identifier}`
            )

            account = await this.authRepository.create({
                phone: type === 'phone' ? identifier : undefined,
                email: type === 'email' ? identifier : undefined
            })
        }

        const {code} = await this.otpService.send(identifier, type as 'phone' | 'email')

        await this.messagingService.otpRequested({
            identifier,
            type,
            code
        })

        console.log('CODE: ', code)

        this.logger.info(`OTP sent successfully to ${identifier}`)

        return {ok: true}
    }

    public async verifyOtp(data: VerifyOtpRequest) {
        const { identifier, code, type } = data

        this.logger.info(
            `OTP verification attempt: identifier=${identifier}`
        )


        await this.otpService.verify(identifier, type as 'phone' | 'email', code);

        let account: Account | null

        if(type === 'phone') 
            account = await this.userRepository.findByPhone(identifier)
        else account = await this.userRepository.findByEmail(identifier)

        if(!account) {
            this.logger.warn(
                `OTP verified but account not found: ${identifier}`
            )
            throw new RpcException({
                code: RpcStatus.NOT_FOUND,
                details: 'Account not found'
            })
        }
        
        if(type === 'phone' && !account.isPhoneVerified) 
            await this.userRepository.update(account.id, {
                isPhoneVerified: true
            })


        if(type === 'email' && !account.isEmailVerified) 
            await this.userRepository.update(account.id, {
                isEmailVerified: true
            })

        this.logger.info(`OTP verified successfully for ${identifier}`)

        this.usersClient.create({ id: account.id }).subscribe()


        return this.generateTokens(account.id)
        
    }

    public async refresh(data: RefreshRequest) {
        const {refreshToken} = data

        this.logger.debug('Refresh token requested')

        const result = this.passportService.verify(refreshToken)

        if(!result.valid) {
            throw new RpcException({
                code: RpcStatus.UNAUTHENTICATED,
                details: result.reason
            })
        }

        this.logger.info(
            `Refresh token verified successfully for user=${result.userId}`
        )

        return this.generateTokens(result.userId)
    }

    private generateTokens(userId: string) {
        const payload: TokenPayload = {sub:userId}

        const accessToken = this.passportService.generate(String(payload.sub), this.ACCESS_TOKEN_TTL)
        
        const refreshToken = this.passportService.generate(String(payload.sub), this.REFRESH_TOKEN_TTL)

        return { accessToken, refreshToken}
    }
}
