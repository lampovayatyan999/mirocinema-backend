import { Module } from '@nestjs/common';

import { GrpcModule } from '@mirocinema/common';
import { SeatClientGrpc } from './seat.grpc';
import { SeatController } from './seat.controller';

@Module({
  imports: [
    GrpcModule.register(['SEAT_PACKAGE'])
  ],
  controllers: [SeatController],
  providers: [SeatClientGrpc],
  exports: [SeatClientGrpc]
})
export class SeatModule {}
