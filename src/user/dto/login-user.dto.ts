import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'mehdi@gmail.com', description: 'Email pour login' })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'Email est obligatoire' })
  email: string;

  @ApiProperty({ example: 'Mehdi123', description: 'Mot de passe pour login' })
  @IsNotEmpty({ message: 'Password est obligatoire' })
  password: string;
}