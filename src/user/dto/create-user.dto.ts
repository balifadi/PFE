import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsIn, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {

  @ApiProperty({ example: 'Mehdi', description: 'Nom de l’utilisateur' })
  @IsString()
  @IsNotEmpty({ message: 'Nom est obligatoire' })
  @Matches(/^[A-Za-z][A-Za-z0-9 ]*$/, { message: 'Nom invalide' })
  nom: string;

  // ✅ AJOUT
  @ApiProperty({ example: 'Ali', description: 'Prénom de l’utilisateur' })
  @IsString()
  @IsNotEmpty({ message: 'Prénom est obligatoire' })
  @Matches(/^[A-Za-z][A-Za-z ]*$/, { message: 'Prénom invalide' })
  prenom: string;

  @ApiProperty({ example: 'mehdi@gmail.com' })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty()
  @Matches(/^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.(com|net|org)$/, {
    message: 'Email invalide'
  })
  email: string;

  @ApiProperty({ example: 'Mehdi123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^[A-Za-z0-9]+$/, { message: 'Password invalide' })
  password: string;

  // ✅ AJOUT
  @ApiProperty({ example: '20123456' })
  @IsString()
  @IsNotEmpty({ message: 'Téléphone est obligatoire' })
  @Matches(/^[0-9]{8,15}$/, { message: 'Téléphone invalide' })
  telephone: string;

  @ApiProperty({
    enum: ['admin', 'client', 'hotel-manager', 'agence-manager']
  })
  @IsString()
  @IsIn(['admin', 'client', 'hotel-manager', 'agence-manager'])
  role: 'admin' | 'client' | 'hotel-manager' | 'agence-manager';
}