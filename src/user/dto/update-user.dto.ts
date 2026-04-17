import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {

  @ApiPropertyOptional({ example: 'Nouveau nom' })
  nom?: string;

  @ApiPropertyOptional({ example: 'Nouveau prénom' })
  prenom?: string;

  @ApiPropertyOptional({ example: 'nouveau@email.com' })
  email?: string;

  @ApiPropertyOptional({ example: '20123456' })
  telephone?: string;

  @ApiPropertyOptional({ example: 'Nouveau123', description: 'Nouveau mot de passe' })
  password?: string;
}