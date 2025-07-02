import { Query } from '@nestjs/cqrs';
import { SourceEntity } from '../../entities/sources.entity';

export class FindSourceByMovieSlugQuery extends Query<SourceEntity[]> {
  constructor(public readonly slug: string) {
    super();
  }
}
