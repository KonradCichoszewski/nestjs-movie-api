import { IsNotEmpty, IsString, Length } from 'class-validator';
import { MAX_GENRE_NAME_LENGTH, MIN_GENRE_NAME_LENGTH } from 'src/shared/const';

export class CreateGenreDto {
  @IsNotEmpty()
  @IsString()
  @Length(MIN_GENRE_NAME_LENGTH, MAX_GENRE_NAME_LENGTH)
  name: string;
}
