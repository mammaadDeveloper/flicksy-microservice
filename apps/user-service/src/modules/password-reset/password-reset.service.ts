import { Injectable, NotFoundException } from '@nestjs/common';
import { PasswordRepositoryService } from './services/repository.service';
import { UserEntity } from '../users/entities/user.entity';
import { PasswordResetTokenType } from 'src/shared/types/token.type';
import { v4 as uuidV4 } from 'uuid';
import { PasswordExistsType } from 'src/shared/types/password-reset.type';

@Injectable()
export class PasswordResetService {
  constructor(private readonly repository: PasswordRepositoryService) {}

  async generate(user: UserEntity, type: PasswordResetTokenType): Promise<string> {
    const tokenOrCode: string =
      type === PasswordResetTokenType.CODE
        ? Math.floor(100000 + Math.random() * 900000).toString()
        : uuidV4();

    await this.repository.create(user, type, tokenOrCode);

    return tokenOrCode;
  }

  async verify(userId: number, type: PasswordResetTokenType, token: string): Promise<boolean> {
    return await this.repository.setUsed(userId, token, type);
  }

  async reset(id: number, newPassword: string): Promise<void> {
    await this.repository.changeUserPassword(id, newPassword);
  }
  async exists(credential: PasswordExistsType) {
    const token = await this.repository.exists(credential);
    
    if (!token) throw new NotFoundException('Password reset token not found');

    return token;
  }
}
