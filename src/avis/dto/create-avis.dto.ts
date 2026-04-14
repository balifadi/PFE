import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max, IsIn } from 'class-validator';

export class CreateAvisDto {

  @ApiProperty({ example: 'hotel', enum: ['hotel', 'zone', 'agence'] })
  @IsString()
  @IsNotEmpty()
  @IsIn(['hotel', 'zone', 'agence'])
  type: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  note: number;

  @ApiProperty({ example: 'Très bon service', required: false })
  @IsString()
  @IsOptional()
  commentaire?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  targetId: number;

}