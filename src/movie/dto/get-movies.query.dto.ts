import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import {
  MAX_GENRE_NAME_LENGTH,
  MAX_MOVIE_TITLE_LENGTH,
  MIN_GENRE_NAME_LENGTH,
  MIN_MOVIE_TITLE_LENGTH,
} from 'src/shared/const';
import { PaginationQueryDto } from 'src/shared/dto/pagination.query.dto';

export enum MoviesSortBy {
  ID = 'id',
  TITLE = 'title',
  RELEASE_DATE = 'releaseDate',
}

export class GetMoviesQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @Length(MIN_MOVIE_TITLE_LENGTH, MAX_MOVIE_TITLE_LENGTH)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(MIN_GENRE_NAME_LENGTH, MAX_GENRE_NAME_LENGTH)
  genre?: string;

  @IsOptional()
  @IsEnum(MoviesSortBy)
  sortBy: MoviesSortBy = MoviesSortBy.ID;
}
