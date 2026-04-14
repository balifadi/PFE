import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateFactureDto {

  @ApiPropertyOptional({ description: 'Nouveau statut de la facture', example: 'payée' })
  @IsOptional()
  @IsString()
  statut?: string;

  @ApiPropertyOptional({ description: 'Montant total mis à jour', example: 300 })
  @IsOptional()
  @IsNumber()
  montant_Total?: number;

  @ApiPropertyOptional({ description: 'Nouvelle date de la facture', example: '2026-04-05T12:00:00Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date_Facture?: Date;
}