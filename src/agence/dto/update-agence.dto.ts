import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAgenceDto {

  @ApiPropertyOptional({ example: 'Agence Sousse' })
  @IsOptional()
  @IsString()
  nom?: string;

  @ApiPropertyOptional({ example: 'Sousse' })
  @IsOptional()
  @IsString()
  ville?: string;

  @ApiPropertyOptional({ example: '98765432' })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiPropertyOptional({ example: 35.8256 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 10.6369 })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}