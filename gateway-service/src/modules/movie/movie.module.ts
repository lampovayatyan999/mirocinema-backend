import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieClientGrpc } from './movie.grpc';
import { GrpcModule } from '@mirocinema/common';

@Module({
  imports: [
    GrpcModule.register(['MOVIE_PACKAGE'])
  ],
  controllers: [MovieController],
  providers: [MovieClientGrpc],
  exports: [MovieClientGrpc]
})
export class MovieModule {}
