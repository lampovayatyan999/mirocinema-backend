import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class PatchUserRequest {
    @ApiPropertyOptional({
    example: 'Anton Chigurh'
    })
    @IsString()
    @IsNotEmpty()
    public name!: string;
}