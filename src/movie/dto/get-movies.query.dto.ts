import { IsOptional, IsString, Length } from 'class-validator';
import {
  MAX_GENRE_NAME_LENGTH,
  MAX_MOVIE_TITLE_LENGTH,
  MIN_GENRE_NAME_LENGTH,
  MIN_MOVIE_TITLE_LENGTH,
} from 'src/shared/const';

export class GetMoviesQueryDto {
  @IsOptional()
  @IsString()
  @Length(MIN_MOVIE_TITLE_LENGTH, MAX_MOVIE_TITLE_LENGTH)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(MIN_GENRE_NAME_LENGTH, MAX_GENRE_NAME_LENGTH)
  genre?: string;
}
