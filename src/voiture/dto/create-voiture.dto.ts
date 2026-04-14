import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateVoitureDto {

  @ApiProperty({ example: 'Toyota', description: 'Marque de la voiture' })
  @IsString()
  @IsNotEmpty()
  marque: string;

  @ApiProperty({ example: 'Corolla', description: 'Modèle de la voiture' })
  @IsString()
  @IsNotEmpty()
  modele: string;

  @ApiProperty({ example: '123 TUN 456', description: 'Immatriculation de la voiture' })
  @IsString()
  @IsNotEmpty()
  immatriculation: string;

  @ApiProperty({ example: 'disponible', description: 'État de la voiture' })
  @IsString()
  @IsNotEmpty()
  etat: string;

  @ApiProperty({ example: 120, minimum: 0, description: 'Prix par jour' })
  @IsNumber()
  @Min(0)
  prix_Jour: number;

  @ApiProperty({ example: 1, description: 'ID de l’agence' })
  @IsNumber()
  agenceId: number;
}