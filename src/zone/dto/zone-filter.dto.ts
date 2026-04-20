import { IsOptional, IsNumber, IsString } from 'class-validator';

export class ZoneFilterDto {

  // 🔍 Search
  @IsOptional()
  @IsString()
  search?: string;

  // 🎯 Filtrage
  @IsOptional()
  @IsString()
  ville?: string;

  // 📄 Pagination
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  // 🔄 Sorting
  @IsOptional()
  sortBy?: string = 'idzone';

  @IsOptional()
  order?: 'ASC' | 'DESC' = 'ASC';
}