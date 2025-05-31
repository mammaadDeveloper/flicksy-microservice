import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserRepositoryService } from './services/repository.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UserRepositoryService
  ) {}

  async find(id: number): Promise<UserEntity> {
    return await this.repository.find(id);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.repository.findByEmail(email);
  }

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    return await this.repository.create(data);
  }
}
