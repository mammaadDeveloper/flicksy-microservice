import { Query } from '@nestjs/cqrs';
import { ImageEntity } from '../../entities/image.entity';

export class FindByIdQuery extends Query<ImageEntity | null> {
  constructor(public readonly id: string) {
    super();
  }
}
