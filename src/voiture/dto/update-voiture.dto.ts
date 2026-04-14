import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateVoitureDto {

  @ApiPropertyOptional({ example: 'BMW' })
  @IsString()
  @IsOptional()
  marque?: string;

  @ApiPropertyOptional({ example: 'X5' })
  @IsString()
  @IsOptional()
  modele?: string;

  @ApiPropertyOptional({ example: '456 TUN 789' })
  @IsString()
  @IsOptional()
  immatriculation?: string;

  @ApiPropertyOptional({ example: 'louée' })
  @IsString()
  @IsOptional()
  etat?: string;

  @ApiPropertyOptional({ example: 150, minimum: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  prix_Jour?: number;
}