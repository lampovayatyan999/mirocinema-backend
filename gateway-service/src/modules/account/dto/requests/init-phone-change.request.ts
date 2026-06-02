import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches } from "class-validator";

export class InitPhoneChangeRequest {
    @ApiProperty({
        example: '+79111234567'
    })
    @IsNotEmpty()
    @Matches(/^\+?\d{10,15}$/)
    public phone!: string
}