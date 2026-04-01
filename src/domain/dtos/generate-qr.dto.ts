import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateQrDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  name: string;
}