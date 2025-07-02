/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Expose, Transform } from 'class-transformer';
import { VideoQualityEnum, VideoEncodingEnum } from 'src/shared';

export class SourceResponseDto {
  @Expose({ name: 'slug' })
  id: string;

  @Expose()
  quality: VideoQualityEnum;

  @Expose()
  size: number;

  @Expose()
  file?: string;

  @Expose()
  @Transform(({ value }) => value ?? [])
  subtitleFileIds: string[];

  @Expose()
  encoding: VideoEncodingEnum;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @Transform(({ obj }) => obj?.movie?.slug)
  movieId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
