import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReservationDto {

  @ApiProperty({ example: '2026-04-10', description: 'Date de début de la réservation' })
  @IsDateString()
  @IsNotEmpty()
  date_debut: Date;

  @ApiProperty({ example: '2026-04-15', description: 'Date de fin de la réservation' })
  @IsDateString()
  @IsNotEmpty()
  date_fin: Date;

  @ApiProperty({ example: 1, description: 'ID de la chambre choisie' })
  @IsNumber()
  @IsNotEmpty()
  chambreId: number;

  @ApiProperty({ example: 1, description: 'ID de l’hôtel concerné' })
  @IsNumber()
  @IsNotEmpty()
  hotelId: number;
}