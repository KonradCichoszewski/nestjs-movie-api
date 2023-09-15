import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class GenreQueryDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  includeMovies?: boolean;
}
