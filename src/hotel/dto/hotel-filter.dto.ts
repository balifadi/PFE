import { IsOptional, IsNumber, IsString } from 'class-validator';

export class HotelFilterDto {

  // 🔍 Search (mot clé général)
  @IsOptional()
  @IsString()
  search?: string;

  // 🎯 Filtrage
  @IsOptional()
  @IsString()
  ville?: string;

  @IsOptional()
  @IsNumber()
  nb_Etoiles?: number;

  @IsOptional()
  @IsNumber()
  nb_chambres?: number;

  // 📄 Pagination
  @IsOptional()
  @IsNumber()
  page?: number = 1; // page actuelle

  @IsOptional()
  @IsNumber()
  limit?: number = 10; // nombre d'éléments par page

  // 🔄 Sorting
  @IsOptional()
  sortBy?: string = 'idhotel'; // champ à trier

  @IsOptional()
  order?: 'ASC' | 'DESC' = 'ASC'; // ordre
}