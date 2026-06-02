import { IsInt, IsNotEmpty, IsString} from "class-validator"


class SeatDto {
    @IsString()
    public seatId!: string

    @IsInt()
    public price!: number
}

export class CreateRefundRequest {
    @IsString()
    @IsNotEmpty()
    public bookingId!: string
}