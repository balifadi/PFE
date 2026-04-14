import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateZoneDto {

  @ApiProperty({ example: 'Zone Touristique Djerba', description: 'Nom de la zone' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'Djerba', description: 'Ville de la zone' })
  @IsString()
  @IsNotEmpty()
  ville: string;

  @ApiProperty({ example: 'Belle zone touristique avec plage', description: 'Description de la zone' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'zone.jpg', description: 'Image de la zone' })
  @IsOptional()
  @IsString()
  imagePath?: string;

  @ApiProperty({ example: 33.8076, description: 'Latitude' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 10.8451, description: 'Longitude' })
  @IsNumber()
  longitude: number;
}