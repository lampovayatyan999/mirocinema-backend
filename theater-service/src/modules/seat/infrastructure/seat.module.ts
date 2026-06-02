import { Module } from "@nestjs/common";
import { SeatGrpcController } from "../interfaces/grpc/seat.grpc.controller";
import { SeatRepositoryPort } from "../domain/ports/seat.repository.port";
import { SeatPrismaRepository } from "./prisma/seat.prisma.repository";
import { ListSeatsUsecase } from "../application/quiries/list-seats.usecase";
import { GetSeatUsecase } from "../application/quiries/get-seat.usecase";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { PROTO_PATHS } from "@mirocinema/contracts";
import { BookingPort } from "../domain/ports/booking.port";
import { BookingGrpcAdapter } from "./grpc/booking.grpc.adaptor";



@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'BOOKING_PACKAGE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        package: 'booking.v1',
                        protoPath: PROTO_PATHS.BOOKING,
                        url: configService.getOrThrow<string>('BOOKING_GRPC_URL')
                    }
                }),
                inject: [ConfigService]
            }
        ])
    ],
    controllers: [SeatGrpcController],
    providers: [
        {
            provide: SeatRepositoryPort,
            useClass: SeatPrismaRepository
        },
        {
            provide: BookingPort,
            useClass: BookingGrpcAdapter
        },
        ListSeatsUsecase,
        GetSeatUsecase
    ]
})
export class SeatModule {}