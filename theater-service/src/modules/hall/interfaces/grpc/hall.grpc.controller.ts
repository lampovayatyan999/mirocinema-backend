import { Controller } from "@nestjs/common";

import { GrpcMethod } from "@nestjs/microservices";
import type { CreateHallRequest, CreateHallResponse, GetHallRequest, GetHallResponse, ListHallsRequest, ListHallsResponse } from "@mirocinema/contracts/gen/ts/hall";
import { ListHallsUsecase } from "../../application/quiries/list-halls.usecase";
import { GetHallUsecase } from "../../application/quiries/get-hall.usecase";
import { CreateHallUsecase } from "../../application/commands/create-hall.usecase";

@Controller()
export class HallGrpcController {
    public constructor(private readonly listUC: ListHallsUsecase, private readonly getUC: GetHallUsecase, private readonly createUC: CreateHallUsecase) {}

    @GrpcMethod('HallService', 'CreateHall')
    public async create(data: CreateHallRequest) {
        const hall = await this.createUC.execute(data)

        return { hall }
    }

    
    @GrpcMethod('HallService', 'GetHall')
    public async getById(data: GetHallRequest) {
        const hall = await this.getUC.execute(data.id)
    
        return {hall}
    }

    

    @GrpcMethod('HallService', 'ListHalls')
    public async list(data: ListHallsRequest): Promise<ListHallsResponse> {
        const halls = await this.listUC.execute(data.theaterId)

        return { halls }
    }

}