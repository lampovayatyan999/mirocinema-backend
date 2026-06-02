import { SeatEntity } from "../entities/seat.entity";

export abstract class SeatRepositoryPort {
    public abstract findById(ud: string): Promise<SeatEntity | null>
    public abstract findByHall(hallId: string): Promise<SeatEntity[]>
}