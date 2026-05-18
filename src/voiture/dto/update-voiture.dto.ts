import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateVoitureDto {

  @ApiPropertyOptional({ example: 'louée' })
  @IsString()
  @IsOptional()
  etat?: string;

  @ApiPropertyOptional({ example: 150, minimum: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  prix_Jour?: number;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...' })
  @IsString()
  @IsOptional()
  imagePath?: string;
}
