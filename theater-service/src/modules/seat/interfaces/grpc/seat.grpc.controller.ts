import { Controller } from "@nestjs/common"
import { ListSeatsUsecase } from "../../application/quiries/list-seats.usecase"
import { GetSeatUsecase } from "../../application/quiries/get-seat.usecase"
import type { GetSeatRequest, GetSeatResponse, ListSeatsRequest, ListSeatsResponse } from "@mirocinema/contracts/gen/ts/seat"
import { GrpcMethod } from "@nestjs/microservices"



@Controller()
export class SeatGrpcController {
    public constructor(private readonly listUC: ListSeatsUsecase, private readonly getUC: GetSeatUsecase) {}

    @GrpcMethod('SeatService', 'GetSeat')
    public async getById(data: GetSeatRequest): Promise<GetSeatResponse> {
        const seat = await this.getUC.execute(data.id)

        return {
            seat: {
                id: seat.id,
                row: seat.row,
                number: seat.number,
                price: seat.price,
                type: seat.type,
                hallId: seat.hallId,
                status: 'available',
            }
        }
    }

    

    @GrpcMethod('SeatService', 'ListSeatsByHall')
    public async list(data: ListSeatsRequest): Promise<ListSeatsResponse> {
        const seats = await this.listUC.execute(data.hallId, data.screeningId)

        return { seats }
    }

}