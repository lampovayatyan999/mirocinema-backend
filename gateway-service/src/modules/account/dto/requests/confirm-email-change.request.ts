import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, Length } from "class-validator";

export class ConfirmEmailChangeRequest {
    @ApiProperty({
        example: 'vito.cornleone@example.com'
    })
    @IsNotEmpty()
    @IsEmail()
    public email!: string

    @ApiProperty({example: '123456'})
    @IsNotEmpty()
    @IsNumberString()
    @Length(6, 6)
    public code!: string
}