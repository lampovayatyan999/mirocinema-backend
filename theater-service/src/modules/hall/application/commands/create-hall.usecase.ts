import { Injectable } from "@nestjs/common";
import { HallRepositoryPort, RowLayout } from "../../domain/ports/hall.repository.port";
import { PrismaService } from "@/infra/prisma/prisma.service";


@Injectable()
export class CreateHallUsecase {
    public constructor(private readonly repository: HallRepositoryPort, private readonly PrismaService: PrismaService) {}

    public async execute(data: {
        name: string,
        theaterId: string,
        layout: RowLayout[]
    }) {
        return this.PrismaService.$transaction(async () => {
            const hall = await this.repository.create(data) 

            await this.repository.createSeats({hallId: hall.id, layout: data.layout})
            
            return hall
        })
    }
}