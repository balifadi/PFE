import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class UpdateChambreDto {

  @ApiPropertyOptional({ example: 102 })
  @IsNumber()
  @IsOptional()
  numero?: number;

  @ApiPropertyOptional({ example: 3, minimum: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  capacite?: number;

  @ApiPropertyOptional({ example: 'occupée' })
  @IsString()
  @IsOptional()
  etat?: string;

  @ApiPropertyOptional({ example: 150, minimum: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  prix_Nuit?: number;
}