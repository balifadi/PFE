import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { FavorisType } from '../../entities/favoris.entity';

export class CreateFavorisDto {

  @ApiProperty({
    description: 'Type de favori',
    enum: FavorisType,
    example: FavorisType.HOTEL
  })
  @IsEnum(FavorisType, { message: 'Type invalide' })
  type: FavorisType;

  @ApiProperty({
    description: 'ID de l’élément (hotel, agence ou zone)',
    example: 1
  })
  @IsNumber({}, { message: 'targetId doit être un nombre' })
  targetId: number;
}