import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infra/prisma/prisma.module';
import { TheaterModule } from './modules/theater/infrastructure/theater.module';
import { HallModule } from './modules/hall/infrastructure/hall.module';
import { SeatModule } from './modules/seat/infrastructure/seat.module';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, TheaterModule, HallModule, SeatModule],
})
export class AppModule {}
