import { Command } from '@nestjs/cqrs';
import { ProfileEntity } from '../../entities/profile.entity';
import { CreateProfileDto } from '../../dto/create-profile.dto';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class CreateProfileCommand extends Command<ProfileEntity> {
  constructor(
    public readonly user: UserEntity,
    public readonly data: CreateProfileDto,
  ) {
    super();
  }
}
