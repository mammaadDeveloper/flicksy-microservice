import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfileByUserQuery } from './get-by-user.query';
import { ProfileEntity } from '../../entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@QueryHandler(GetProfileByUserQuery)
export class GetProfileByUserQueryHandler
  implements IQueryHandler<GetProfileByUserQuery>
{
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly repository: Repository<ProfileEntity>,
  ) {}
  async execute(query: GetProfileByUserQuery): Promise<ProfileEntity> {
    return await this.repository.findOne({
      where: { user: { id: query.userId } },
    });
  }
}
