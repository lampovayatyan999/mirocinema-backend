import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from 'src/modules/auth/auth.module'
import { PassportModule } from '@mirocinema/passport'
import { getPassportConfig } from './config'
import { AccountModule } from 'src/modules/account/account.module'
import { UsersModule } from 'src/modules/users/users.module'
import { ObservabilityModule } from 'src/observability/observability.module'
import { MovieModule } from 'src/modules/movie/movie.module'
import { CategoryModule } from 'src/modules/category/category.module'
import { TheaterModule } from 'src/modules/theater/theater.module'
import { HallModule } from 'src/modules/hall/hall.module'
import { SeatModule } from 'src/modules/seat/seat.module'
import { ScreeningModule } from 'src/modules/screening/screening.module'
import { PaymentModule } from 'src/modules/payment/payment.module'
import { WebhookModule } from 'src/modules/webhook/webhook.module'
import { RefundModule } from 'src/modules/refund/refund.module'
import { BookingModule } from 'src/modules/booking/booking.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				`.env.${process.env.NODE_ENV}.local`, `.env.${process.env.NODE_ENV}`, '.env'
			],
		}),
		PassportModule.registerAsync({
			useFactory: getPassportConfig,
			inject: [ConfigService]
		}),
		ObservabilityModule,
		AuthModule,
		AccountModule,
		UsersModule,
		MovieModule,
		CategoryModule,
		TheaterModule,
		HallModule,
		SeatModule,
		ScreeningModule,
		PaymentModule,
		RefundModule,
		WebhookModule,
		BookingModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
