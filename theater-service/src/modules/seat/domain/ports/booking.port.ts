export abstract class BookingPort {
    public abstract listReservedSeats(
        hallId: string,
        screeningId: string
    ): Promise<string[]>
}