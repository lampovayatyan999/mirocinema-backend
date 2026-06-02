import { Module } from '@nestjs/common';
import { MediaClientGrpc } from './media.grpc';
import { GrpcModule } from '@mirocinema/common';

@Module({
  imports: [
    GrpcModule.register(['MEDIA_PACKAGE'])
  ],
  providers: [MediaClientGrpc],
  exports: [MediaClientGrpc]
})
export class MediaModule {}
