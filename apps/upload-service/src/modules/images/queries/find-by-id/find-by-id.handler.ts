import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindByIdQuery } from './find-by-id.query';
import { ImageEntity } from '../../entities/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@QueryHandler(FindByIdQuery)
export class FindByIdHandler implements IQueryHandler<FindByIdQuery> {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly repository: Repository<ImageEntity>,
  ) {}
  async execute(query: FindByIdQuery): Promise<ImageEntity | null> {
    return await this.repository.findOne({ where: { id: query.id } });
  }
}
