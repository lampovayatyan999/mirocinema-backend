
import { Type } from "class-transformer";
import {  IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

export enum SeatType {
    CHAIR = 'chair',
    SOFA2 = 'sofa2',
    SOFA3 = 'sofa3'
}

class RowConfig {
    @IsInt()
    public row!: number

    @IsNumber()
    public columns!: number

    @IsEnum(SeatType)
    public type!: SeatType

    @IsInt()
    public price!: number
}

export class CreateHallRequest {
    @IsString()
    @IsNotEmpty()
    public name!: string

    @IsString()
    @IsNotEmpty()
    public theaterId!: string

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => RowConfig)
    public layout!: RowConfig[]
}