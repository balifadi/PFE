import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateNotificationDto {

  @ApiProperty({ example: 'reservation', description: 'Type de notification (zone, hotel, agence, reservation, location)' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'Votre réservation est confirmée', description: 'Message de la notification' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ example: 1, description: 'Client spécifique, si null → notification générale' })
  @IsNumber()
  @IsOptional()
  clientId?: number;
}