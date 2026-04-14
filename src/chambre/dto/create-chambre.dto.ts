import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty, Min } from 'class-validator';

export class CreateChambreDto {

  @ApiProperty({ example: 101 })
  @IsNumber()
  numero: number;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsNumber()
  @Min(1)
  capacite: number;

  @ApiProperty({ example: 'disponible' })
  @IsString()
  @IsNotEmpty()
  etat: string;

  @ApiProperty({ example: 120, minimum: 0 })
  @IsNumber()
  @Min(0)
  prix_Nuit: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  hotelId: number;
}