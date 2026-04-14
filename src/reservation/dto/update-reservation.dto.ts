import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateReservationDto {

  @ApiPropertyOptional({ example: '2026-04-12', description: 'Nouvelle date de début' })
  @IsDateString()
  @IsOptional()
  date_debut?: Date;

  @ApiPropertyOptional({ example: '2026-04-16', description: 'Nouvelle date de fin' })
  @IsDateString()
  @IsOptional()
  date_fin?: Date;

  @ApiPropertyOptional({ example: 'confirmé', description: 'Statut de la réservation' })
  @IsString()
  @IsOptional()
  statut?: string;
}