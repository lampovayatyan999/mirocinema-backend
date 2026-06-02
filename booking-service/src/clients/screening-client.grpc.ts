import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'

import type {
    GetScreeningRequest,
    ScreeningServiceClient
} from '@mirocinema/contracts/gen/ts/screening'

@Injectable()
export class ScreeningClientGrpc implements OnModuleInit {
    private screeningService!: ScreeningServiceClient

    public constructor(
        @Inject('SCREENING_SERVICE') private readonly client: ClientGrpc
    ) {}

    public onModuleInit() {
        this.screeningService =
            this.client.getService<ScreeningServiceClient>('ScreeningService')
    }

    public getById(data: GetScreeningRequest) {
        return this.screeningService.getScreening(data)
    }
}