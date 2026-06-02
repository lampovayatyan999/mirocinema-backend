import { Module } from "@nestjs/common";
import { TheaterGrpcController } from "../interfaces/grpc/theater.grpc.controller";
import { TheaterRepositoryPort } from "../domain/ports/theater.repository.port";
import { TheaterPrismaRepository } from "./prisma/theater.prisma.repository";
import { ListTheatersUseCase } from "../application/queries/list-theaters.usecase";
import { GetTheaterUsecase } from "../application/queries/get-theater.usecase";
import { CreateTheaterUseCase } from "../application/commands/create-theater.usecase";


@Module({
    controllers: [TheaterGrpcController],
    providers: [
        {
            provide: TheaterRepositoryPort,
            useClass: TheaterPrismaRepository
        },
        ListTheatersUseCase,
        GetTheaterUsecase,
        CreateTheaterUseCase
    ]
})
export class TheaterModule {}