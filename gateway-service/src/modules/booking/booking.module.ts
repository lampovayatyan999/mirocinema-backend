import { Global, Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingClientGrpc } from './booking.grpc';
import { GrpcModule } from '@mirocinema/common';


@Global()
@Module({
  imports: [
    GrpcModule.register(['BOOKING_PACKAGE'])
  ],
  controllers: [BookingController],
  providers: [BookingClientGrpc],
  exports: [BookingClientGrpc]
})
export class BookingModule {}
