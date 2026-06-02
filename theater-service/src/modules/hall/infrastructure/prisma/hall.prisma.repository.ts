import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { HallEntity } from "../../domain/entities/hall.entity";
import { HallRepositoryPort, RowLayout } from "../../domain/ports/hall.repository.port";
import { SeatCreateManyInput } from "@prisma/generated/models";


@Injectable()
export class HallPrismaRepository implements HallRepositoryPort {
    public constructor(private readonly prismaService: PrismaService) {}

    
    public async create(data: 
        {
            name: string,
            theaterId: string,
            layout: RowLayout[]
        }): Promise<HallEntity> {
        const hall = await this.prismaService.hall.create({
            data: {
                name: data.name,
                theater: {
                    connect: {
                        id: data.theaterId
                    }
                }
            }
        })

        return new HallEntity(hall.id, hall.name, hall.theaterId, hall.createdAt, hall.updatedAt)
    }

    
    public async findById(id: string): Promise<HallEntity | null> {
        const hall = await this.prismaService.hall.findUnique({
            where: {
                id
            }
        })

        return hall ? new HallEntity(hall.id, hall.name, hall.theaterId, hall.createdAt, hall.updatedAt) : null
    }


    public async listByTheater(theaterId: string): Promise<HallEntity[]> {
        const items = await this.prismaService.hall.findMany({
            where: {
                theaterId
            },
            orderBy: {
                name: 'asc'
            }
        })   

        return items.map(hall => new HallEntity(hall.id, hall.name, hall.theaterId, hall.createdAt, hall.updatedAt))
    }

    public async findSeatsByHall(hallId: string) {
        return this.prismaService.seat.findMany({
            where: { hallId }
        })
    }

    public async createSeats(data: { hallId: string; layout: RowLayout[]; }): Promise<void> {
        const seats: SeatCreateManyInput[] = []

        for(const rowConfig of data.layout) {
            for(let num = 1; num <= rowConfig.columns; num++) {
                seats.push({
                    row: rowConfig.row,
                    number: num,
                    hallId: data.hallId,
                    type: rowConfig.type,
                    price: rowConfig.price,
                    x: num,
                    y: rowConfig.row
                })
            }
        }
    }
}