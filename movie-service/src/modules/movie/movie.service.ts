import { Injectable } from '@nestjs/common';
import { MovieRepository } from './movie.repository';
import type { GetMovieRequest, ListMoviesRequest, ListMoviesResponse } from '@mirocinema/contracts/gen/ts/movie';
import { RpcException } from '@nestjs/microservices';
import { RpcStatus } from '@mirocinema/common';
import { MovieMapper } from './movie.mapper';
import { MovieCacheService } from './movie.cache.service';
import { MovieCacheKeys } from './movie.cache.keys';
import { movies } from 'src/infra/database/drizzle/schema/movies.schema';

@Injectable()
export class MovieService {
    public constructor(private readonly movieRepository: MovieRepository, private readonly movieCacheService: MovieCacheService) {}

    public async getAll(data: ListMoviesRequest) {
        const filter = {
            category: data.category ?? undefined,
            random: data.random === true,
            limit: data.limit > 0 ? data.limit : undefined
        }

        const cached = await this.movieCacheService.getAll<ListMoviesResponse['movies']>(filter)

        if(cached) return {movies: cached}

        const movies = await this.movieRepository.findAll(filter)
        const result = movies.map(MovieMapper.toMovie)

        await this.movieCacheService.setAll(filter, result)

        return {
            movies: result
        }
    }

    public async getOne(data: GetMovieRequest) {
        const cacheKey = data.id ? MovieCacheKeys.byId(data.id) : MovieCacheKeys.bySlug(data.slug)

        const cached = await this.movieCacheService.get<typeof movies.$inferSelect>(cacheKey)

        if(cached) return {movie: cached}

        const movie = data.id ? await this.movieRepository.findById(data.id) : await this.movieRepository.findBySlug(data.slug)

        if(!movie) throw new RpcException({
            code: RpcStatus.NOT_FOUND,
            details: 'Movie not found'
        })

        const mapped = MovieMapper.toMovie(movie)
        await this.movieCacheService.set(cacheKey, mapped)

        return {movie: mapped}
    }
}
