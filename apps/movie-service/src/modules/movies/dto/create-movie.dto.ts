import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsDateString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePosterDto } from '../../posters/dto/create-poster.dto';
import { CreateSourceDto } from '../../sources/dto/create-source.dto';
import { CreateTrailerDto } from '../../trailers/dto/create-trailer.dto';

export class CreateMovieDto {
  @IsUUID()
  slug: string;

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
  releaseDate?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePosterDto)
  posters?: CreatePosterDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSourceDto)
  sources?: CreateSourceDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTrailerDto)
  trailers?: CreateTrailerDto[];
}

export class AddMovieCommand {
  slug: string;
  title: string;
  summary: string;
  description?: string;
  director: string;
  year: number;
  releaseDate?: string;
}
