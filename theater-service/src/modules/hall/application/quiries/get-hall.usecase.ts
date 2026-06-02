import { Injectable } from "@nestjs/common";
import { HallRepositoryPort } from "../../domain/ports/hall.repository.port";
import { RpcException } from "@nestjs/microservices";
import { RpcStatus } from "@mirocinema/common/dist";


@Injectable()
export class GetHallUsecase {
    public constructor(private readonly repository: HallRepositoryPort) {}

    public async execute(id: string) {
        const hall = await this.repository.findById(id)

        if(!hall) throw new RpcException({
            code: RpcStatus.NOT_FOUND,
            details: 'Hall not found'
        })

        return hall
    }
}