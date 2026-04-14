import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgenceDto {

  @ApiProperty({ example: 'Agence Tunis' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'Tunis' })
  @IsString()
  @IsNotEmpty()
  ville: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  telephone: string;

  @ApiProperty({ example: 36.8065 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 10.1815 })
  @IsNumber()
  longitude: number;
}