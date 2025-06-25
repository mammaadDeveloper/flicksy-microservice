import { Expose } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  director: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 2)
  year: number;

  @IsOptional()
  @IsDateString()
  release_date?: string;
}

export class AddMovieCommand {
  title: string;
  summary: string;
  description?: string;
  director: string;
  year: number;

  @Expose({ name: 'release_date' })
  releaseDate?: string;
}
