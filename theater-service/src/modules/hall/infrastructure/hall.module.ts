import { Module } from "@nestjs/common";
import { HallGrpcController } from "../interfaces/grpc/hall.grpc.controller";
import { HallRepositoryPort } from "../domain/ports/hall.repository.port";
import { HallPrismaRepository } from "./prisma/hall.prisma.repository";
import { ListHallsUsecase } from "../application/quiries/list-halls.usecase";
import { GetHallUsecase } from "../application/quiries/get-hall.usecase";
import { CreateHallUsecase } from "../application/commands/create-hall.usecase";



@Module({
    controllers: [HallGrpcController],
    providers: [
        {
            provide: HallRepositoryPort,
            useClass: HallPrismaRepository
        },
        ListHallsUsecase,
        GetHallUsecase,
        CreateHallUsecase
    ]
})
export class HallModule {}