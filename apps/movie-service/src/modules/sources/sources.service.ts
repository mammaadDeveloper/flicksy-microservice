import { Injectable } from '@nestjs/common';
import { SourcesRepository } from './services/repository';
import { AddSourceCommand } from './dto/create-source.dto';
import { SourceEntity } from './entities/sources.entity';

@Injectable()
export class SourcesService {
  constructor(private readonly repository: SourcesRepository) {}

  async create(
    data: AddSourceCommand[],
  ): Promise<SourceEntity | SourceEntity[]> {
    return await this.repository.create(data);
  }
}
