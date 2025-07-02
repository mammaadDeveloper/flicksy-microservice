import { Query } from '@nestjs/cqrs';
import { PosterEntity } from '../../entities/posters.entity';
import { PaginateDto } from 'src/common';

export class GetAllPostersQuery extends Query<PosterEntity[]> {
  constructor(public readonly paginate: PaginateDto) {
    super();
  }
}
