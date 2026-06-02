import { RedisService } from '@/infrastructure/redis/redis.service';
import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { generateCode } from 'patcode';
import { RpcException } from '@nestjs/microservices';
import { RpcStatus } from '@mirocinema/common/dist';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class OtpService {
    public constructor(
        private readonly redisService: RedisService,
        private readonly logger: PinoLogger
    ) {
        // Устанавливаем контекст логгера для текущего класса
        this.logger.setContext(OtpService.name);
    }

    public async send(identifier: string, type: 'phone' | 'email') {
        this.logger.info(`Generating OTP code for ${type}: ${identifier}`);
        
        const { code, hash } = this.generateCode();

        const redisKey = `otp:${type}:${identifier}`;
        await this.redisService.set(redisKey, hash, 'EX', 300);
        
        this.logger.info(`OTP hash successfully saved to Redis for ${type}: ${identifier}`);
        
        return { code, hash };
    }

    public async verify(identifier: string, type: 'phone' | 'email', code: string) {
        this.logger.info(`Verifying OTP code for ${type}: ${identifier}`);

        const redisKey = `otp:${type}:${identifier}`;
        const storedHash = await this.redisService.get(redisKey);

        if (!storedHash) {
            this.logger.warn(`OTP verification failed: code expired or not found for ${type}: ${identifier}`);
            throw new RpcException({
                code: RpcStatus.NOT_FOUND,
                details: 'Invalid or expired code'
            });
        }

        const incomingHash = createHash('sha256').update(code).digest('hex');

        if (storedHash !== incomingHash) {
            this.logger.warn(`OTP verification failed: hashes do not match for ${type}: ${identifier}`);
            throw new RpcException({
                code: RpcStatus.NOT_FOUND,
                details: 'Invalid or expired code'
            });
        }

        await this.redisService.del(redisKey);
        
        this.logger.info(`OTP successfully verified and removed from Redis for ${type}: ${identifier}`);
    }

    private generateCode() {
        const code = generateCode();
        const hash = createHash('sha256').update(code).digest('hex');

        return { code, hash };
    }
}