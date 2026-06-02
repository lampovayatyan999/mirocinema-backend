
import { ApiProperty } from "@nestjs/swagger";
import {  IsNotEmpty, IsString } from "class-validator";

export class CreateTheaterRequest {
    @ApiProperty({
        example: 'Avrora'
    })
    @IsString()
    @IsNotEmpty()
    public name!: string

    @ApiProperty({
        example: 'Street Pt.'
    })
    @IsString()
    @IsNotEmpty()
    public address!: string
}