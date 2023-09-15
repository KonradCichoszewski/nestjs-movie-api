export class UpdateMovieDto {
  title?: string;
  description?: string;
  releaseDate?: Date;
  genresToAdd?: string[];
  genresToRemove?: string[];
}
