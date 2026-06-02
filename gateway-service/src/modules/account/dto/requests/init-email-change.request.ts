import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class InitEmailChangeRequest {
    @ApiProperty({
        example: 'vito.cornleone@example.com'
    })
    @IsNotEmpty()
    @IsEmail()
    public email!: string
}