import { Injectable } from "@nestjs/common";
import { TheaterRepositoryPort } from "../../domain/ports/theater.repository.port";
import type { CreateTheaterRequest } from "@mirocinema/contracts/gen/ts/theater";

@Injectable()
export class CreateTheaterUseCase {
    public constructor(private readonly repository: TheaterRepositoryPort) {}

    public execute(data: {name: string, address: string}) {
        return this.repository.create(data)
    }
}