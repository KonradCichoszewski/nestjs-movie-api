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
import { nullToUndefined } from 'src/shared/utils/null-to-undefined.transformer';

export class UpdateMovieDto {
  @Transform(nullToUndefined)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  @Length(MIN_MOVIE_TITLE_LENGTH, MAX_MOVIE_TITLE_LENGTH)
  title?: string;

  @Transform(nullToUndefined)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  @Length(MIN_MOVIE_DESCRIPTION_LENGTH, MAX_MOVIE_DESCRIPTION_LENGTH)
  description?: string;

  @Transform(({ value }) => (value === null ? undefined : new Date(value)))
  @IsOptional()
  @IsDate({
    message:
      'releaseDate must be a value convertable to JavaScript Date object',
  })
  releaseDate?: Date;

  @Transform(nullToUndefined)
  @IsOptional()
  @IsString({ each: true })
  @Length(MIN_GENRE_NAME_LENGTH, MAX_GENRE_NAME_LENGTH, { each: true })
  genresToAdd?: string[];

  @Transform(nullToUndefined)
  @IsOptional()
  @IsString({ each: true })
  @Length(MIN_GENRE_NAME_LENGTH, MAX_GENRE_NAME_LENGTH, { each: true })
  genresToRemove?: string[];
}
