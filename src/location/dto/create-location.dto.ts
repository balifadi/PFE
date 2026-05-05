import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLocationDto {

  @ApiProperty({ example: '2026-04-05', description: 'Date de début de la location' })
  @IsDateString()
  @IsNotEmpty()
  date_debut: Date;

  @ApiProperty({ example: '2026-04-10', description: 'Date de fin de la location' })
  @IsDateString()
  @IsNotEmpty()
  date_fin: Date;


  @ApiProperty({ example: 1, description: 'Voiture choisie' })
  @IsNumber()
  @IsNotEmpty()
  voitureId: number;

  @ApiProperty({ example: 1, description: 'ID de l\'agence' })
  @IsNumber()
  @IsNotEmpty()
  idagence: number;

  @ApiProperty({ example: 890.75, description: 'Montant total de la location' })
  @IsNumber()
  montant: number;

}
