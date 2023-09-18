import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import {
  MAX_GENRE_NAME_LENGTH,
  MAX_MOVIE_TITLE_LENGTH,
  MIN_GENRE_NAME_LENGTH,
  MIN_MOVIE_TITLE_LENGTH,
} from 'src/shared/const';
import { PaginationQueryDto } from 'src/shared/dto/pagination.query.dto';
import { MoviesSortBy } from './get-movies.query.dto';

export class SearchMoviesQueryDto extends PaginationQueryDto {
  @IsNotEmpty()
  @IsString()
  @Length(
    Math.min(MIN_MOVIE_TITLE_LENGTH, MIN_GENRE_NAME_LENGTH),
    Math.max(MAX_MOVIE_TITLE_LENGTH, MAX_GENRE_NAME_LENGTH),
  )
  titleOrGenre: string;

  @IsOptional()
  @IsEnum(MoviesSortBy)
  sortBy: MoviesSortBy = MoviesSortBy.ID;
}
