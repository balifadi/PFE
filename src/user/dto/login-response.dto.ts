import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 'Mehdi' })
  nom: string;

  @ApiProperty({ example: 'mehdi@gmail.com' })
  email: string;

  @ApiProperty({ example: 'client', enum: ['admin', 'client', 'hotel-manager', 'agence-manager'] })
  role: 'admin' | 'client' | 'hotel-manager' | 'agence-manager';
}