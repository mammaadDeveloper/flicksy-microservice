import { Injectable } from '@nestjs/common';
import { PasswordRepositoryService } from './services/repository.service';
import { UserEntity } from '../users/entities/user.entity';
import { PasswordResetTokenType } from 'src/shared/types/token.type';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class PasswordResetService {
  constructor(private readonly repository: PasswordRepositoryService) {}

  async generate(user: UserEntity, type: PasswordResetTokenType) {
    const tokenOrCode: string =
      type === PasswordResetTokenType.CODE
        ? Math.floor(100000 + Math.random() * 900000).toString()
        : uuidV4();

    await this.repository.create(user, type, tokenOrCode);

    return tokenOrCode;
  }

  async verify(user: UserEntity, type: PasswordResetTokenType, token: string){
    return await this.repository.setUsed(user, token, type);
  }

  async reset(id: number, newPassword: string){
    await this.repository.changeUserPassword(id, newPassword);
  }
}
