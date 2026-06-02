import { Injectable } from "@nestjs/common";
import { TheaterRepositoryPort } from "../../domain/ports/theater.repository.port";

@Injectable()
export class ListTheatersUseCase {
    public constructor(private readonly repository: TheaterRepositoryPort) {}

    public execute() {
        return this.repository.findAll()
    }
}