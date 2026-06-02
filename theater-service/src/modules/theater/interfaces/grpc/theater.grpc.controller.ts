import { Controller } from "@nestjs/common";
import { ListTheatersUseCase } from "../../application/queries/list-theaters.usecase";
import { GetTheaterUsecase } from "../../application/queries/get-theater.usecase";
import { CreateTheaterUseCase } from "../../application/commands/create-theater.usecase";
import { GrpcMethod } from "@nestjs/microservices";
import type { CreateTheaterRequest, CreateTheaterResponse, GetTheaterRequest, GetTheaterResponse, ListTheatersResponse } from "@mirocinema/contracts/gen/ts/theater";

@Controller()
export class TheaterGrpcController {
    public constructor(private readonly listUC: ListTheatersUseCase, private readonly getUC: GetTheaterUsecase, private readonly createUC: CreateTheaterUseCase) {}

    @GrpcMethod('TheaterService', 'ListTheaters')
    public async getAll(): Promise<ListTheatersResponse> {
        const theaters = await this.listUC.execute()

        return { theaters }
    }

    @GrpcMethod('TheaterService', 'GetTheater')
    public async getById(data: GetTheaterRequest): Promise<GetTheaterResponse> {
        const theater = await this.getUC.execute(data.id)
    
        return {theater}
    }

    @GrpcMethod('TheaterService', 'CreateTheater')
    public async create(data: CreateTheaterRequest): Promise<CreateTheaterResponse> {
        const theater = await this.createUC.execute(data)

        // @ts-ignore
        return { theater }
    }
}