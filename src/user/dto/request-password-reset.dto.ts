import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestPasswordResetDto {
  @ApiProperty({ example: 'client@example.com' })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'Email est obligatoire' })
  email: string;
}
