import { Expose, Type } from 'class-transformer';
import { PosterEntity } from 'src/modules/posters/entities/posters.entity';
import { SourceEntity } from 'src/modules/sources/entities/sources.entity';
import { TrailerEntity } from 'src/modules/trailers/entities/trailers.entity';

export class MovieResponseDto {
  @Expose({ name: 'slug' })
  id: string;

  @Expose()
  title: string;

  @Expose()
  summary: string;

  @Expose()
  description?: string;

  @Expose()
  director: string;

  @Expose()
  year: number;

  @Expose({ name: 'releaseDate' })
  released_date?: Date;

  @Expose({ name: 'createdAt' })
  created_at: Date;

  @Expose()
  @Type(() => PosterEntity)
  posters?: PosterEntity[];

  @Expose()
  @Type(() => SourceEntity)
  sources?: SourceEntity[];

  @Expose()
  @Type(() => TrailerEntity)
  trailers?: TrailerEntity[];
}
