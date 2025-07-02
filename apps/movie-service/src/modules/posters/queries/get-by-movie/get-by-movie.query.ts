import { Query } from '@nestjs/cqrs';
import { PosterEntity } from '../../entities/posters.entity';

export class GetByMovieSlugQuery extends Query<PosterEntity[]> {
  constructor(public readonly slug: string) {
    super();
  }
}
