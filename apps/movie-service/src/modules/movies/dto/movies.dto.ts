import { IntersectionType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginateDto } from 'src/common';

export class GetMoviesDto {
  @IsOptional()
  @IsBoolean()
  poster?: boolean;

  @IsOptional()
  @IsBoolean()
  source?: boolean;

  @IsOptional()
  @IsBoolean()
  trailer?: boolean;
}

export class GetMoviesWithPaginateDto extends IntersectionType(
  PaginateDto,
  GetMoviesDto,
) {}
