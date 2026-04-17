import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 'Mehdi' })
  nom: string;

  // ✅ AJOUT
  @ApiProperty({ example: 'Ali' })
  prenom: string;

  @ApiProperty({ example: 'mehdi@gmail.com' })
  email: string;

  // ✅ AJOUT
  @ApiProperty({ example: '20123456' })
  telephone: string;

  @ApiProperty({
    example: 'client',
    enum: ['admin', 'client', 'hotel-manager', 'agence-manager']
  })
  role: 'admin' | 'client' | 'hotel-manager' | 'agence-manager';
}