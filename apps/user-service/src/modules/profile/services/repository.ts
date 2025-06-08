import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { GetProfileByUserQuery } from '../queries';
import { ProfileEntity } from '../entities/profile.entity';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { CreateProfileCommand, UpdateProfileCommand } from '../commands';
import { UpdateAvatarDto, UpdateProfileDto } from '../dto';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@Injectable()
export class ProfileRepository {
  constructor(
    private readonly command: CommandBus,
    private readonly query: QueryBus,
  ) {}

  async get(userId: number): Promise<ProfileEntity>{
    return await this.query.execute(new GetProfileByUserQuery(userId));
  }

  async create(user: UserEntity, data: CreateProfileDto){
    return await this.command.execute(new CreateProfileCommand(user, data));
  }

  async update(userId: number, data: UpdateProfileDto | UpdateAvatarDto){
    return this.command.execute(new UpdateProfileCommand(userId, data));
  }
}
