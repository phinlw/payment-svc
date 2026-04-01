import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateRqDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  name: string;
}