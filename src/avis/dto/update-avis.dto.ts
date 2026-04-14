import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, Max, IsIn } from 'class-validator';

export class UpdateAvisDto {

  @ApiPropertyOptional({ example: 'hotel', enum: ['hotel', 'zone', 'agence'] })
  @IsOptional()
  @IsString()
  @IsIn(['hotel', 'zone', 'agence'])
  type?: string;

  @ApiPropertyOptional({ example: 4, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  note?: number;

  @ApiPropertyOptional({ example: 'Service correct' })
  @IsOptional()
  @IsString()
  commentaire?: string;
}