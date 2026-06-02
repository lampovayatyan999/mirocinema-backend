import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, Length, Matches } from "class-validator";

export class ConfirmPhoneChangeRequest {
    @ApiProperty({
        example: '+79111234567'
    })
    @IsNotEmpty()
    @Matches(/^\+?\d{10,15}$/)
    public phone!: string

    @ApiProperty({example: '123456'})
    @IsNotEmpty()
    @IsNumberString()   
    @Length(6, 6)
    public code!: string
}