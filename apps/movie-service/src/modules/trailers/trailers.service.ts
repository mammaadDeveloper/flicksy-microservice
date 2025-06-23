import { Injectable } from '@nestjs/common';
import { TrailersRepository } from './services/repository';
import { AddTrailerCommand } from './dto/create-trailer.dto';
import { TrailerEntity } from './entities/trailers.entity';

@Injectable()
export class TrailersService {
  constructor(private readonly repository: TrailersRepository) {}

  async create(
    data: AddTrailerCommand[],
  ): Promise<TrailerEntity | TrailerEntity[]> {
    return await this.repository.create(data);
  }
}
