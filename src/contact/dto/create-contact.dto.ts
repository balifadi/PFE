import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail, IsNumber } from 'class-validator';

export class CreateContactDto {

  @ApiProperty({ example: 'Mehdi', description: 'Nom' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiPropertyOptional({ example: 'Yahya', description: 'Prénom' })
  @IsOptional()
  @IsString()
  prenom?: string;

  @ApiPropertyOptional({ example: '12345678', description: 'Téléphone' })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiProperty({ example: 'mehdi@gmail.com', description: 'Email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Bonjour, je veux réserver...', description: 'Message' })
  @IsString()
  @IsNotEmpty()
  message: string;
  
}