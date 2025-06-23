import { Query } from '@nestjs/cqrs';
import { ImageEntity } from '../../entities/image.entity';

export class FindImageByFileAndIdQuery extends Query<ImageEntity | null> {
  constructor(
    public readonly filename: string,
    public readonly id: string,
  ) {
    super();
  }
}
