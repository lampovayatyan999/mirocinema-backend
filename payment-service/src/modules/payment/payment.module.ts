import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentRepository } from './payment.repository';
import { ConfigService } from '@nestjs/config';
import { GrpcModule } from '@mirocinema/common';
import { BookingClientGrpc } from '@/clients/booking.client';
import Stripe from 'stripe';
import { STRIPE_TOKEN } from './payment.service';

@Module({
    imports: [
        GrpcModule.register(['BOOKING_PACKAGE'])  // ← Добавь
    ],
    controllers: [PaymentController],
    providers: [
        {
            provide: STRIPE_TOKEN,
            inject: [ConfigService],
            useFactory: (config: ConfigService) => new Stripe(
                config.getOrThrow('STRIPE_SECRET_KEY'),
                { apiVersion: '2020-08-27' }
            ),
        },
        PaymentService,
        PaymentRepository,
        BookingClientGrpc,
    ],
    exports: [STRIPE_TOKEN, BookingClientGrpc],
})
export class PaymentModule {}