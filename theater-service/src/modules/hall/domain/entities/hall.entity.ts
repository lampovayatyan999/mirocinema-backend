export class HallEntity {
    public constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly theaterId: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {
        
    }
}