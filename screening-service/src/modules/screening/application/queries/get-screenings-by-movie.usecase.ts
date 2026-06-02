import { Injectable } from "@nestjs/common";
import { ScreeningRepositoryPort } from "../../domain/ports/screening.repository.port";
import { Theater, TheaterPort } from "../../domain/ports/theater.grpc.port";
import { Hall, HallPort } from "../../domain/ports/hall.port";
import { SeatPort } from "../../domain/ports/seat.port";
import { Movie, MoviePort } from "../../domain/ports/movie.port";
import { resolveDayRange } from "src/shared/utils/resolve-day-range";

@Injectable()
export class GetScreeningsByMovieUsecase {
    public constructor(private readonly repository: ScreeningRepositoryPort, private readonly theaterPort: TheaterPort, private readonly hallPort: HallPort, private readonly seatPort: SeatPort, private readonly moviePort: MoviePort) {}

    public async execute(input: {movie: string; date?: string}) {
        const { start, end } = resolveDayRange(input.date)

        const screening = await this.repository.findManyByMovie(input.movie, start, end)

        if(!screening.length) return []

        const theaterCache = new Map<string, Promise<Theater | null>>()
        const hallCache = new Map<string, Promise<Hall | null>>()

        const enriched = await Promise.all(
            screening.map(async screening => {
                const hall = await this.getHallCached(screening.hallId, hallCache)

                if(!hall) return null

                const theater = await this.getTheaterCached(hall.theaterId, theaterCache)

                if(!theater) return null

                const seatTypes = await this.seatPort.listSeatTypes(screening.hallId, screening.id)

                return {
                    id: screening.id,
                    startAt: screening.startAt,
                    endAt: screening.endAt,
                    hall,
                    theater,
                    seatTypes
                }
            })
        )

        return enriched.filter(Boolean)
    }

    private getTheaterCached(theaterId: string, cache: Map<string, Promise<Theater | null>>): Promise<Theater | null> {
        let promise = cache.get(theaterId)

        if(!promise) {
            promise = this.theaterPort.findById(theaterId)

            cache.set(theaterId, promise)
        }

        return promise
    }

    private getHallCached(hallId: string, cache: Map<string, Promise<Hall | null>>): Promise<Hall | null> {
        let promise = cache.get(hallId)

        if(!promise) {
            promise = this.hallPort.findById(hallId)

            cache.set(hallId, promise)
        }

        return promise
    }
}