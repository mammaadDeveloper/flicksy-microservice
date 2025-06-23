import { Injectable } from '@nestjs/common';
import { AddPosterCommand } from './dto/create-poster.dto';
import { PosterRepository } from './services/repository';
import { PosterEntity } from './entities/posters.entity';

@Injectable()
export class PostersService {
  constructor(private readonly repository: PosterRepository) {}

  async create(
    data: AddPosterCommand[],
  ): Promise<PosterEntity | PosterEntity[]> {
    return await this.repository.create(data);
  }
}
