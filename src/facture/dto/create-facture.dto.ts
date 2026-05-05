import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFactureDto {

  @ApiProperty({ description: 'ID du client', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  clientId: number;

  @ApiPropertyOptional({ description: 'ID de la réservation associée', example: 10 })
  @IsOptional()
  @IsNumber()
  reservationId?: number;

  @ApiPropertyOptional({ description: 'ID de la location associée', example: 5 })
  @IsOptional()
  @IsNumber()
  locationId?: number;

  @ApiProperty({ description: 'Mode de paiement', example: 'espece' })
  @IsString()
  @IsNotEmpty()
  mode_Paiement: string;

  @ApiProperty({ description: 'Date de la facture', example: '2026-04-04T10:00:00Z' })
  @Type(() => Date)
  @IsDate()
  date_Facture: Date;

  @ApiPropertyOptional({ description: 'Statut de la facture', example: 'en attente' })
  @IsOptional()
  @IsString()
  statut?: string;
}