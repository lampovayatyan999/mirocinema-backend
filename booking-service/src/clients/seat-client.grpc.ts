import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'

import type {
    GetSeatRequest,
    SeatServiceClient
} from '@mirocinema/contracts/gen/ts/seat'

@Injectable()
export class SeatClientGrpc implements OnModuleInit {
    private seatService!: SeatServiceClient

    public constructor(
        @Inject('SEAT_SERVICE') private readonly client: ClientGrpc
    ) {}

    public onModuleInit() {
        this.seatService =
            this.client.getService<SeatServiceClient>('SeatService')
    }

    public getById(data: GetSeatRequest) {
        return this.seatService.getSeat(data)
    }
}