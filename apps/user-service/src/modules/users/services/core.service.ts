import { plainToClass } from 'class-transformer';

import { Injectable, NotFoundException } from '@nestjs/common';

import { UserRepositoryService } from './repository.service';
import { UserEntity } from '../entities/user.entity';
import { UsersCreateResponseDto } from '../dto/users.dto';

@Injectable()
export class CoreUsersService {
  constructor(private readonly repository: UserRepositoryService) {}

  async find(id: number): Promise<UserEntity> {
    return await this.repository.find(id);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.repository.findByEmail(email);

    if (!user)
      throw new NotFoundException('User not found with the provided email');

    return user;
  }

  async create(data: Partial<UserEntity>): Promise<UsersCreateResponseDto> {
    const user = await this.repository.create(data);
    return plainToClass(UsersCreateResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
