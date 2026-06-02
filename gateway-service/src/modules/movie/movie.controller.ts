import {Controller, Get, HttpCode, HttpStatus, Param, Query} from "@nestjs/common"
import { MovieClientGrpc } from "./movie.grpc"
import {  Protected } from "src/shared/decorators"
import { GetMoviesRequest } from "./dto"
import { MovieMapper } from "./movie.mapper"


@Controller('movies')
export class MovieController {
  public constructor(private readonly movie: MovieClientGrpc) {}


  @Get('movies')
  @HttpCode(HttpStatus.OK)
  public async getAll(@Query() dto: GetMoviesRequest) {
    const response = await this.movie.call('listMovies', {
      category: dto.category ?? '',
      random: dto.random ?? false,
      limit: dto.limit ?? 0,
    })
    
    return Array.isArray(response.movies) ? response.movies.map(movie => MovieMapper.toMovie(movie)) : []
  }


  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  public async getBySlug(@Param('slug') slug: string) {
    const { movie } = await this.movie.call('getMovie', {slug})

    return MovieMapper.toMovie(movie)
  }
}