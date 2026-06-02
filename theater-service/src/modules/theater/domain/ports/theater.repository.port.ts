import { TheaterEntity } from "../entities/theater.entity";

export abstract class TheaterRepositoryPort {
    public abstract findAll(): Promise<TheaterEntity[]>
    public abstract findById(id: string): Promise<TheaterEntity | null> 
    public abstract create(data: {
        name: string,
        address: string
    }): Promise<TheaterEntity>
} 