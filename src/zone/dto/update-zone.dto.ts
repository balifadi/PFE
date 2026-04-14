import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateZoneDto {

  @ApiPropertyOptional({ example: 'Zone Hammamet' })
  @IsOptional()
  @IsString()
  nom?: string;

  @ApiPropertyOptional({ example: 'Hammamet' })
  @IsOptional()
  @IsString()
  ville?: string;

  @ApiPropertyOptional({ example: 'Zone touristique balnéaire' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'zone-new.jpg' })
  @IsOptional()
  @IsString()
  imagePath?: string;

  @ApiPropertyOptional({ example: 36.4000 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 10.6000 })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}