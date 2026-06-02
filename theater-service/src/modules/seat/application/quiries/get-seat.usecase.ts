import { Injectable } from "@nestjs/common";
import { SeatRepositoryPort } from "../../domain/ports/seat.repository.port";
import { RpcException } from "@nestjs/microservices";
import { RpcStatus } from "@mirocinema/common/dist";


@Injectable()
export class GetSeatUsecase {
    public constructor(private readonly repository: SeatRepositoryPort) {}

    public async execute(id: string) {
        const seat = await this.repository.findById(id)

        if(!seat) throw new RpcException({
            code: RpcStatus.NOT_FOUND,
            details: 'Seat not found'
        })

        return seat
    }
}