// reply-contact.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ReplyContactDto {
  @ApiProperty({ example: 'Bonjour, voici notre réponse...' })
  @IsString()
  @IsNotEmpty()
  adminReply: string;
}