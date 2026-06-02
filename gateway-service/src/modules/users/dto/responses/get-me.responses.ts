import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetMeResponse {
  @ApiProperty({
    example: 'X6KBMtnCDkbrPN_I0YXG8'
  })
  public id!: string;

  @ApiPropertyOptional({
    example: 'Anton Chigurh'
  })
  public name!: string;

  @ApiProperty({
    example: 'anton.chigurh@teacinema.ru'
  })
  public email!: string;

  @ApiProperty({
    example: '+77777777777'
  })
  public phone!: string;

  @ApiPropertyOptional({
    example: 'https://cdn.teacinema.ru/users/e0db4163fc2aab147599c750906396d3'
  })
  public avatar!: string;
}