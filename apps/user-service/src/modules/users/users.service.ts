import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserRepositoryService } from './services/repository.service';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UsersCreateResponseDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly repository: UserRepositoryService) {}

  async find(id: number): Promise<UserEntity> {
    return await this.repository.find(id);
  }

  async findWithFormat(id: number): Promise<UsersCreateResponseDto>{
    const user = await this.repository.find(id);

    if(!user)
      throw new NotFoundException('User not found');

    return plainToInstance(UsersCreateResponseDto, user, {excludeExtraneousValues: true});
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.repository.findByEmail(email);

    if (!user) return null;

    return user;
  }

  async create(data: Partial<UserEntity>): Promise<UsersCreateResponseDto> | never {
    try {
      const user = await this.repository.create(data);
      return plainToClass(UsersCreateResponseDto, user, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Failed to insert user.', error);
      throw error;
    }
  }
}
