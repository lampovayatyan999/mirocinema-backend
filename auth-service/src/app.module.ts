import { Module } from "@nestjs/common";
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisModule } from './infrastructure/redis/redis.module';
import { OtpModule } from './modules/otp/otp.module';
import { databaseEnv, grpcEnv, passportEnv, redisEnv, rmqEnv, getPassportConfig } from "./config";
import type { AllConfigs } from "./config";
import { AccountModule } from './modules/account/account.module';
import { MessagingModule } from "./infrastructure/messaging/messaging.module";
import { UsersModule } from "./modules/users/users.module";
import { ObservabilityModule } from "./observability/observability.module";
import { LoggerModule } from 'nestjs-pino';
import { PassportModule } from "@mirocinema/passport";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`, 
        `.env.${process.env.NODE_ENV}`, 
        '.env'
      ], 
      load: [databaseEnv, grpcEnv, passportEnv, redisEnv, rmqEnv]
    }), 
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL,
        messageKey: 'msg', 
        transport: {
          target: 'pino/file',
          options: {
            destination: '/var/log/services/auth/auth.log',
            mkdir: true
          }
        },
        customProps: () => ({
          service: 'auth-service'
        })
      }
    }),
    PassportModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigs>) => getPassportConfig(configService)
    }),
    PrismaModule, 
    AuthModule, 
    RedisModule, 
    MessagingModule,
    ObservabilityModule,
    OtpModule,
    AccountModule,
    UsersModule
  ]
})
export class AppModule {}