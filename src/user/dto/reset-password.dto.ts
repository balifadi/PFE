import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'client@example.com' })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'Email est obligatoire' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'Code OTP est obligatoire' })
  @Matches(/^[0-9]{6}$/, { message: 'Code OTP invalide' })
  otp: string;

  @ApiProperty({ example: 'Nouveau123' })
  @IsNotEmpty({ message: 'Mot de passe obligatoire' })
  @MinLength(6)
  @Matches(/^[A-Za-z0-9]+$/, { message: 'Mot de passe invalide' })
  password: string;
}
