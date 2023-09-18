import { Movie } from '@prisma/client';
import { PaginationMetadataDto } from 'src/shared/dto/pagination-metadata.dto';

export class GetMoviesPaginatedResponseDto {
  items: Movie[];
  pagination: PaginationMetadataDto;
}
