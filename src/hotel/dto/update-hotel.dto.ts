import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateHotelDto {

  @ApiPropertyOptional({ example: 'Hotel Luxury' })
  @IsOptional()
  @IsString()
  nom?: string;

  @ApiPropertyOptional({ example: 'Sousse' })
  @IsOptional()
  @IsString()
  ville?: string;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsNumber()
  nb_Etoiles?: number;

  @ApiPropertyOptional({ example: '+21698765432' })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiPropertyOptional({ example: 'new-image.jpg' })
  @IsOptional()
  @IsString()
  imagePath?: string;

  @ApiPropertyOptional({ example: 35.8256 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 10.6369 })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}