import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import {
  MAX_GENRE_NAME_LENGTH,
  MAX_MOVIE_DESCRIPTION_LENGTH,
  MAX_MOVIE_TITLE_LENGTH,
  MIN_GENRE_NAME_LENGTH,
  MIN_MOVIE_DESCRIPTION_LENGTH,
  MIN_MOVIE_TITLE_LENGTH,
} from 'src/shared/const';

export class CreateMovieDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
  @IsString()
  @Length(MIN_MOVIE_TITLE_LENGTH, MAX_MOVIE_TITLE_LENGTH)
  title: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
  @IsString()
  @Length(MIN_MOVIE_DESCRIPTION_LENGTH, MAX_MOVIE_DESCRIPTION_LENGTH)
  description: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate({
    message:
      'releaseDate must be a value convertable to JavaScript Date object',
  })
  releaseDate: Date;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @Length(MIN_GENRE_NAME_LENGTH, MAX_GENRE_NAME_LENGTH, { each: true })
  genres: string[];
}
