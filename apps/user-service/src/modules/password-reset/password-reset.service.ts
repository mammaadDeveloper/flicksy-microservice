import { Injectable, NotFoundException } from '@nestjs/common';
import { PasswordRepositoryService } from './services/repository.service';
import { UserEntity } from '../users/entities/user.entity';
import { PasswordResetTokenType } from 'src/shared/types/token.type';
import { v4 as uuidV4 } from 'uuid';
import { PasswordCredentialsType } from 'src/shared/types/password-reset.type';
import { EncryptionService } from 'src/shared/utils/encryption/encryption.service';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly repository: PasswordRepositoryService,
    private readonly encryption: EncryptionService,
  ) {}

  async generate(
    user: UserEntity,
    type: PasswordResetTokenType,
  ): Promise<string> {
    const tokenOrCode: string =
      type === PasswordResetTokenType.CODE
        ? Math.floor(100000 + Math.random() * 900000).toString()
        : uuidV4();

    await this.repository.create(
      user,
      type,
      this.encryption.encrypt(tokenOrCode),
    );

    return tokenOrCode;
  }

  async verify(
    userId: number,
    type: PasswordResetTokenType,
    token: string,
  ): Promise<boolean> {
    const encodedToken = this.encryption.encrypt(token);
    return await this.repository.setUsed(userId, encodedToken, type);
  }

  async reset(id: number, newPassword: string): Promise<void> {
    await this.repository.changeUserPassword(id, newPassword);
  }
  async find(credential: PasswordCredentialsType) {
    const { token, type, user } = credential;
    const encodedToken = this.encryption.encrypt(token);
    const tokenEntity = await this.repository.find({
      user,
      token: encodedToken,
      type,
    });

    if (!tokenEntity)
      throw new NotFoundException('Password reset token not found');

    return tokenEntity;
  }

  async exists(credentials: PasswordCredentialsType){
    return this.repository.exists(credentials);
  }
}
