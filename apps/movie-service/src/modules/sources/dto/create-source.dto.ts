import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  ArrayUnique,
} from 'class-validator';
import { VideoQualityEnum } from 'src/shared';

export class CreateSourceDto {
  @IsEnum(VideoQualityEnum)
  quality: VideoQualityEnum;

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
  @IsString()
  encoding?: string;
}
