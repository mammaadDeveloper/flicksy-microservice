import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum PosterTypeEnum {
  POSTER = 'poster',
  THUMBNAIL = 'thumbnail',
  COVER = 'cover',
}
export class CreatePosterDto {
  @IsNotEmpty()
  @IsUUID()
  fileId: string;

  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsEnum(PosterTypeEnum)
  type: PosterTypeEnum;

  @IsOptional()
  @IsString()
  mimetype?: string;

  @IsOptional()
  @IsNumber()
  size?: number;
}

export class AddPosterCommand {
  fileId: string;
  filename: string;
  type: PosterTypeEnum;
  mimetype?: string;
  size?: number;
}
