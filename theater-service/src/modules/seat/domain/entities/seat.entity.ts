export class SeatEntity {
    public constructor (
        public readonly id: string,
        public readonly row: number,
        public readonly number: number,
        public readonly price: number,
        public readonly type: string,
        public readonly hallId: string,
    ) {}
}