import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PaginateDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @Min(10)
  @Max(100)
  limit?: number;
}
