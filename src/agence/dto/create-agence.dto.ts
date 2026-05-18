import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAgenceDto {

  @ApiProperty({ example: 'Agence Tunis' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'Tunis' })
  @IsString()
  @IsNotEmpty()
  ville: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  telephone: string;

  @ApiProperty({ example: 10, description: 'Nombre de voitures' })
  @IsNumber()
  nb_voitures: number;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...', description: 'Image principale de l’agence' })
  @IsOptional()
  @IsString()
  imagePath?: string;

  @ApiProperty({ example: 36.8065 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 10.1815 })
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({ example: 15, description: 'ID du Agence Manager assigné à cette agence' })
  @IsOptional()
  @IsNumber()
  agenceManagerId?: number;
}
