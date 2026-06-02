import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { MovieRepository } from './movie.repository';
import { MovieCacheService } from './movie.cache.service';

@Module({
  controllers: [MovieController],
  providers: [MovieService, MovieRepository, MovieCacheService],
})
export class MovieModule {}