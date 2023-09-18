import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString, Length } from 'class-validator';
import {
  MAX_GENRE_NAME_LENGTH,
  MAX_MOVIE_DESCRIPTION_LENGTH,
  MAX_MOVIE_TITLE_LENGTH,
  MIN_GENRE_NAME_LENGTH,
  MIN_MOVIE_DESCRIPTION_LENGTH,
  MIN_MOVIE_TITLE_LENGTH,
} from 'src/shared/const';

export class UpdateMovieDto {
  @IsString()
  @Length(MIN_MOVIE_TITLE_LENGTH, MAX_MOVIE_TITLE_LENGTH)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(MIN_MOVIE_DESCRIPTION_LENGTH, MAX_MOVIE_DESCRIPTION_LENGTH)
  description?: string;

  @Transform(({ value }) => new Date(value))
  @IsOptional()
  @IsDate({
    message:
      'releaseDate must be a value convertable to JavaScript Date object',
  })
  releaseDate?: Date;

  @IsOptional()
  @IsString({ each: true })
  @Length(MIN_GENRE_NAME_LENGTH, MAX_GENRE_NAME_LENGTH, { each: true })
  genresToAdd?: string[];

  @IsOptional()
  @IsString({ each: true })
  @Length(MIN_GENRE_NAME_LENGTH, MAX_GENRE_NAME_LENGTH, { each: true })
  genresToRemove?: string[];
}
