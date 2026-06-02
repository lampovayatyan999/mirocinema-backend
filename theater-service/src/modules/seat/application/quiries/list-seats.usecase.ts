import { Injectable } from "@nestjs/common";
import { SeatRepositoryPort } from "../../domain/ports/seat.repository.port";
import { RpcException } from "@nestjs/microservices";
import { RpcStatus } from "@mirocinema/common/dist";
import { BookingPort } from "../../domain/ports/booking.port";


@Injectable()
export class ListSeatsUsecase {
    public constructor(private readonly repository: SeatRepositoryPort, private readonly booking: BookingPort) {}

    public async execute(hallId: string, screeningId: string) {
        const seats = await this.repository.findByHall(hallId)

        const reserved = await this.booking.listReservedSeats(hallId, screeningId)

        return seats.map(seat => ({
            ...seat,
            status: reserved.includes(seat.id) ? 'reserved' : 'available'
        }))
    }
}