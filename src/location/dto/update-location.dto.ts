import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateLocationDto {

  @ApiPropertyOptional({ example: '2026-04-06', description: 'Nouvelle date de début' })
  @IsDateString()
  @IsOptional()
  date_debut?: Date;

  @ApiPropertyOptional({ example: '2026-04-12', description: 'Nouvelle date de fin' })
  @IsDateString()
  @IsOptional()
  date_fin?: Date;

  @ApiPropertyOptional({ example: 'confirmée', description: 'Statut de la location' })
  @IsString()
  @IsOptional()
  statut?: string;
}