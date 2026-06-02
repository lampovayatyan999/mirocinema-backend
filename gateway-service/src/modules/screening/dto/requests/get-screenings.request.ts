import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class GetScreeningsRequest {
  @ApiPropertyOptional({
    description: 'Theater ID to filter screenings',
    example: '811l6j9Ctva6e7oCPpelc',
  })
  @IsOptional()
  @IsString()
  public theaterId?: string;

  @ApiPropertyOptional({
    description: 'Target date (ISO or YYYY-MM-DD)',
    example: '2025-11-08',
  })
  @IsOptional()
  @IsISO8601()
  public date?: string;
}