import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ScreeningModel, ScreeningSchema } from "./database/schemas/screening.schema";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PROTO_PATHS } from "@mirocinema/contracts";
import { ScreeningGrpcController } from "../interfaces/grpc/screening.grpc.controller";
import { ScreeningRepositoryPort } from "../domain/ports/screening.repository.port";
import { ScreeningMongooseRepository } from "./database/repositories/screening.mongo.repository";
import { HallPort } from "../domain/ports/hall.port";
import { HallGrpcAdapter } from "./grpc/hall.grpc.adapter";
import { SeatPort } from "../domain/ports/seat.port";
import { SeatGrpcAdapter } from "./grpc/seat.grpc.adapter";
import { MoviePort } from "../domain/ports/movie.port";
import { MovieGrpcAdapter } from "./grpc/movie.grpc.adapter";
import { TheaterPort } from "../domain/ports/theater.grpc.port";
import { TheaterGrpcAdapter } from "./grpc/theater.grpc.adapter";
import { CreateScreeningUseCase } from "../application/commands/create-screening.usecases";
import { GetScreeningsUsecase } from "../application/queries/get-screenings.usecase";
import { GetScreeningsByMovieUsecase } from "../application/queries/get-screenings-by-movie.usecase";
import { GetScreeningUsecase } from "../application/queries/get-screening.usecase";


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ScreeningModel.name,
        schema: ScreeningSchema,
      },
    ]),
    ClientsModule.register([
      {
        name: 'THEATER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'theater.v1',
          protoPath: PROTO_PATHS.THEATER,
          url: 'localhost:50055',
        },
      },
      {
        name: 'HALL_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'hall.v1',
          protoPath: PROTO_PATHS.HALL,
          url: 'localhost:50055',
        },
      },
      {
        name: 'SEAT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'seat.v1',
          protoPath: PROTO_PATHS.SEAT,
          url: 'localhost:50054',
        },
      },
      {
        name: 'MOVIE_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'movie.v1',
          protoPath: PROTO_PATHS.MOVIE,
          url: 'localhost:50053',
        },
      },
    ]),
  ],
  controllers: [ScreeningGrpcController],
  providers: [
    {
      provide: ScreeningRepositoryPort,
      useClass: ScreeningMongooseRepository,
    },
    {
      provide: HallPort,
      useClass: HallGrpcAdapter,
    },
    {
      provide: SeatPort,
      useClass: SeatGrpcAdapter,
    },
    {
      provide: MoviePort,
      useClass: MovieGrpcAdapter,
    },
    {
      provide: TheaterPort,
      useClass: TheaterGrpcAdapter,
    },
    CreateScreeningUseCase,
    GetScreeningsUsecase,
    GetScreeningsByMovieUsecase,
    GetScreeningUsecase,
  ],
})
export class ScreeningModule {}