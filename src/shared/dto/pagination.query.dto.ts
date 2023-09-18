import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../const';
import { SortingDirection } from '../enums/sorting-direction.enum';

export class PaginationQueryDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  page = 1;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  pageSize = DEFAULT_PAGE_SIZE;

  @Transform(({ value }) => (value as string).toLowerCase())
  @IsOptional()
  @IsEnum(SortingDirection)
  sortingDirection: SortingDirection = SortingDirection.ASC;
}
