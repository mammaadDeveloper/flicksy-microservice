import { plainToClass } from 'class-transformer';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserRepositoryService } from './repository.service';
import { UserEntity } from '../entities/user.entity';
import { UsersCreateResponseDto } from '../dto/users.dto';
import { HashingService } from 'src/shared';

@Injectable()
export class CoreUsersService {
  constructor(
    private readonly repository: UserRepositoryService,
    private readonly hashing: HashingService,
  ) {}

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

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.find(userId);

    if (!user) throw new NotFoundException();

    if (!this.hashing.compare(currentPassword, user.password))
      throw new BadRequestException('The password is incorrect.', {
        description: `Unfortunately, the current user's password is incorrect.`,
      });

    const hashedNewPassword = this.hashing.hash(newPassword);

    return await this.repository.changePassword(user, hashedNewPassword);
  }
}
