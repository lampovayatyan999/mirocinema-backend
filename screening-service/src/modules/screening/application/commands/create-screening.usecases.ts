import { Injectable } from "@nestjs/common";
import { ScreeningRepositoryPort } from "../../domain/ports/screening.repository.port";
import { HallPort } from "../../domain/ports/hall.port";
import { RpcException } from "@nestjs/microservices";
import { RpcStatus } from "@mirocinema/common";
import { ScreeningEntity } from "../../domain/entities/screening.entity";
import { nanoid } from "nanoid";


@Injectable()
export class CreateScreeningUseCase {
    public constructor(private readonly repository: ScreeningRepositoryPort, private readonly hallPort: HallPort) {}

    public async execute(input: {movieId: string, hallId: string, startAt: string | Date, endAt: string | Date}) {
        const start = new Date(input.startAt)
        const end = new Date(input.endAt)

        if(!(start < end)) throw new RpcException({
            code: RpcStatus.INVALID_ARGUMENT,
            details: 'endAt must be after startAt'
        })

        const hall = await this.hallPort.findById(input.hallId)

        if(!hall) throw new RpcException({
            code: RpcStatus.NOT_FOUND,
            details: 'Hall not found'
        })

        const overlap = await this.repository.findOverlap(
            input.hallId,
            start,
            end
        )

        if(overlap) throw new RpcException({
            code: RpcStatus.ALREADY_EXISTS,
            details: 'Screening overlaps with existing screen'
        })

        const screening = new ScreeningEntity(
            nanoid(),
            input.hallId,
            input.movieId,
            start,
            end
        )

        await this.repository.create(screening)

        return {ok: true}
    }
}