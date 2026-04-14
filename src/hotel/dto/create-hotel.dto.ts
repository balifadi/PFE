import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateHotelDto {

  @ApiProperty({ example: 'Hotel Royal', description: 'Nom de l’hôtel' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'Tunis', description: 'Ville de l’hôtel' })
  @IsString()
  @IsNotEmpty()
  ville: string;

  @ApiProperty({ example: 5, description: 'Nombre d’étoiles' })
  @IsNumber()
  nb_Etoiles: number;

  @ApiProperty({ example: '+21612345678', description: 'Numéro de téléphone' })
  @IsString()
  @IsNotEmpty()
  telephone: string;

  @ApiPropertyOptional({ example: 'hotel.jpg', description: 'Image de l’hôtel' })
  @IsOptional()
  @IsString()
  imagePath?: string;

  @ApiProperty({ example: 36.8065, description: 'Latitude' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 10.1815, description: 'Longitude' })
  @IsNumber()
  longitude: number;
}