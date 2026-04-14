import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsIn, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Mehdi', description: 'Nom complet de l’utilisateur' })
  @IsString()
  @IsNotEmpty({ message: 'Nom est obligatoire' })
  @Matches(/^[A-Za-z][A-Za-z0-9 ]*$/, { message: 'Nom ne doit pas commencer par un chiffre' })
  nom: string;

  @ApiProperty({ example: 'mehdi@gmail.com', description: 'Email de l’utilisateur' })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'Email est obligatoire' })
  @Matches(/^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+.(com|net|org)$/, {
    message: 'Email doit contenir @ et se terminer par .com, .net ou .org et ne pas commencer par un chiffre'
  })
  email: string;

  @ApiProperty({ example: 'Mehdi123', description: 'Mot de passe de l’utilisateur' })
  @IsString()
  @IsNotEmpty({ message: 'Password est obligatoire' })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  @Matches(/^[A-Za-z0-9]+$/, { message: 'Password doit contenir uniquement lettres et chiffres' })
  password: string;

  @ApiProperty({
    enum: ['admin', 'client', 'hotel-manager', 'agence-manager'],
    example: 'client',
    description: 'Rôle de l’utilisateur'
  })
  @IsString()
  @IsIn(['admin', 'client', 'hotel-manager', 'agence-manager'])
  role: 'admin' | 'client' | 'hotel-manager' | 'agence-manager';
}