import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class VerifyPasswordResetOtpDto {
  @ApiProperty({ example: 'client@example.com' })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'Email est obligatoire' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'Code OTP est obligatoire' })
  @Matches(/^[0-9]{6}$/, { message: 'Code OTP invalide' })
  otp: string;
}
