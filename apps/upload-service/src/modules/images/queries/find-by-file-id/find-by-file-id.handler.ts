import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindImageByFileAndIdQuery } from './find-by-file-id.query';
import { ImageEntity } from '../../entities/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@QueryHandler(FindImageByFileAndIdQuery)
export class FindImageByFileAndIdHandler
  implements IQueryHandler<FindImageByFileAndIdQuery>
{
  constructor(
    @InjectRepository(ImageEntity)
    private readonly repository: Repository<ImageEntity>,
  ) {}
  async execute(query: FindImageByFileAndIdQuery): Promise<ImageEntity | null> {
    const { filename, id } = query;
    return await this.repository.findOne({ where: { filename, id } });
  }
}
