import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import type { CreateScreeningRequest, GetScreeningRequest,  GetScreeningsByMovieRequest,  GetScreeningsRequest } from "@mirocinema/contracts/gen/ts/screening";
import { CreateScreeningUseCase } from "../../application/commands/create-screening.usecases";
import { GetScreeningUsecase } from "../../application/queries/get-screening.usecase";
import { GetScreeningsByMovieUsecase } from "../../application/queries/get-screenings-by-movie.usecase";
import { GetScreeningsUsecase } from "../../application/queries/get-screenings.usecase";

@Controller()
export class ScreeningGrpcController {
    public constructor(private readonly createUC: CreateScreeningUseCase, private readonly getUC: GetScreeningUsecase, private readonly listUc: GetScreeningsUsecase, private readonly getByMovieUC: GetScreeningsByMovieUsecase) {}


    @GrpcMethod('ScreeningService', 'CreateScreening')
    public async create(data: CreateScreeningRequest) {
        return await this.createUC.execute(data)
    }


    @GrpcMethod('ScreeningService', 'GetScreening')
    public async getById(data: GetScreeningRequest) {
        const screenings = await this.getUC.execute(data.id)

        return { screenings }
    }

    @GrpcMethod('ScreeningService', 'GetScreenings')
    public async getAll(data: GetScreeningsRequest) {
        const screenings = await this.listUc.execute(data)
    
        return {screenings}
    }

    @GrpcMethod('ScreeningService', 'GetScreeningsByMovie')
    public async getByMovie(data: GetScreeningsByMovieRequest) {
        const screenings = await this.getByMovieUC.execute(data)
    
        return {screenings}
    }
}