import { Transform } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

// A DTO for validating integer ID parameters
export class IntIdParamDto {
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  id: number;
}
