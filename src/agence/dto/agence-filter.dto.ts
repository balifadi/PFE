import { IsOptional, IsNumber, IsString } from 'class-validator';

export class AgenceFilterDto {

  // 🔍 Search
  @IsOptional()
  @IsString()
  search?: string;

  // 🎯 Filtrage
  @IsOptional()
  @IsString()
  ville?: string;

  @IsOptional()
  @IsNumber()
  nb_voitures?: number;

  // 📄 Pagination
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  // 🔄 Sorting
  @IsOptional()
  sortBy?: string = 'idagence';

  @IsOptional()
  order?: 'ASC' | 'DESC' = 'ASC';
}