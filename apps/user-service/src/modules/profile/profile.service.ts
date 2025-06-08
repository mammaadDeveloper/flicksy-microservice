import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { ProfileRepository } from './services/repository';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileCreateFormattedDto, UpdateAvatarDto, UpdateProfileDto } from './dto';
import { UserEntity } from '../users/entities/user.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProfileService {
  constructor(private readonly repository: ProfileRepository) {}

  async getProfileInfo(userId: number) {
    const info = await this.repository.get(userId);

    if (!info) throw new NotFoundException('Profile not found');

    return plainToInstance(ProfileCreateFormattedDto, info, {
      excludeExtraneousValues: true,
    });
  }

  async storeProfileInfo(user: UserEntity, data: CreateProfileDto) {
    try {
      const profile = await this.repository.create(user, data);
      return plainToInstance(ProfileCreateFormattedDto, profile, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Internal server error',
        error.message,
      );
    }
  }

  async updateProfileInfo(userId: number, data: UpdateProfileDto) {
    const profile = await this.repository.update(userId, data);

    return plainToInstance(ProfileCreateFormattedDto, profile, {
      excludeExtraneousValues: true,
    });
  }

  async updateAvatar(userId: number, data: UpdateAvatarDto){
    const result = await this.repository.update(userId, data);

    return plainToInstance(ProfileCreateFormattedDto, result, {excludeExtraneousValues: true});
  }
}
