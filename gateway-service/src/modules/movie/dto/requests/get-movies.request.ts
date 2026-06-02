import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class GetMoviesRequest {
    @ApiPropertyOptional({
        example: 'classic'
    })
    @IsOptional()
    @IsString()
    @Transform(({value}) => value.toString().trim())
    public category?: string

    @ApiPropertyOptional({
        example: true
    })
    @IsOptional()
    @IsBoolean()
    @Transform(({value}) => {
        if(value === 'true') return true
        if(value === 'false') return false

        return value
    })
    public random?: boolean


    @ApiPropertyOptional({
        example: 13
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Transform(({value}) => (value !== undefined ? Number(value) : undefined))
    public limit?: number
}