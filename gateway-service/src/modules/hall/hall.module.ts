import { Module } from '@nestjs/common';

import { GrpcModule } from '@mirocinema/common';
import { HallClientGrpc } from './hall.grpc';
import { HallController } from './hall.controller';

@Module({
  imports: [
    GrpcModule.register(['HALL_PACKAGE'])
  ],
  controllers: [HallController],
  providers: [HallClientGrpc],
  exports: [HallClientGrpc]
})
export class HallModule {}
