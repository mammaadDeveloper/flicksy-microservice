import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  ArrayUnique,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { MovieEntity } from 'src/modules/movies/entities/movies.entity';
import { VideoEncodingEnum, VideoQualityEnum } from 'src/shared';

export class CreateSourceDto {
  @IsNotEmpty()
  @IsEnum(VideoQualityEnum)
  quality: VideoQualityEnum;

  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsOptional()
  @IsString()
  file?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  subtileFileIds?: string[];

  @IsOptional()
  @IsEnum(VideoEncodingEnum)
  encoding?: VideoEncodingEnum;

  @IsNotEmpty()
  @IsUUID()
  movieId: string;
}

export class AddSourceCommand {
  quality: VideoQualityEnum;
  size: number;
  file?: string;
  subtileFileIds?: string[];
  encoding?: VideoEncodingEnum;
  movie?: MovieEntity;
}
