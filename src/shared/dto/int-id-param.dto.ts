import { Transform } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class IntIdParamDto {
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  id: number;
}
