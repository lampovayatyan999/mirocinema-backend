import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersClientGrpc } from './users.grpc';
import { GrpcModule } from '@mirocinema/common';
import { MediaModule } from '../media/media.module';
import { MediaClientGrpc } from '../media/media.grpc';

@Module({
  imports: [
    GrpcModule.register(['USERS_PACKAGE', 'MEDIA_PACKAGE']),
    MediaModule
  ],
  controllers: [UsersController],
  providers: [UsersClientGrpc, MediaClientGrpc],
  exports: [UsersClientGrpc]
})
export class UsersModule {}