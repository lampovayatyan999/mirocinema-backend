import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './infra/prisma/prisma.module';
import { PaymentModule } from './modules/payment/payment.module';
import { RefundModule } from './modules/refund/refund.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PROTO_PATHS } from '@mirocinema/contracts';
import { StripeModule } from 'nestjs-stripe'; // Импортируем модуль правильно

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        
        StripeModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                apiKey: configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
                apiVersion: '2020-08-27', // Совместимая версия для stripe@8
            }),
        }),

        ClientsModule.registerAsync([
            {
                name: 'BOOKING_PACKAGE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        package: 'booking.v1',
                        protoPath: PROTO_PATHS.BOOKING,
                        url: configService.getOrThrow<string>('BOOKING_GRPC_URL')
                    }
                }),
                inject: [ConfigService]
            }
        ]),
        PrismaModule,
        PaymentModule,
        RefundModule
    ]
})
export class AppModule {}