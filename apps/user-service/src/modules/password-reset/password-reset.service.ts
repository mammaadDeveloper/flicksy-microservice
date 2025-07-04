import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PasswordRepositoryService } from './services/repository.service';
import { UserEntity } from '../users/entities/user.entity';
import { PasswordResetTokenEnum } from 'src/shared/enums/token.enum';
import { v4 as uuidV4 } from 'uuid';
import { PasswordCredentialsType } from 'src/shared/types/password-reset.type';
import { EncryptionService } from 'src/shared/utils/encryption/encryption.service';
import { PasswordResetTokenEntity } from './entities/password.entity';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly repository: PasswordRepositoryService,
    private readonly encryption: EncryptionService,
  ) {}

  async generate(
    user: UserEntity,
    type: PasswordResetTokenEnum,
  ): Promise<string> {
    const tokenOrCode: string =
      type === PasswordResetTokenEnum.CODE
        ? Math.floor(100000 + Math.random() * 900000).toString()
        : uuidV4();

    if (await this.repository.check(user.id))
      throw new ConflictException('The token has already been sent.');

    await this.repository.create(
      user,
      type,
      this.encryption.encrypt(tokenOrCode),
    );

    return tokenOrCode;
  }

  async verify(
    userId: number,
    type: PasswordResetTokenEnum,
    token: string,
  ): Promise<boolean> {
    const encodedToken = this.encryption.encrypt(token);
    return await this.repository.setUsed(userId, encodedToken, type);
  }

  async reset(id: number, newPassword: string): Promise<void> {
    await this.repository.changeUserPassword(id, newPassword);
  }
  async find(credential: PasswordCredentialsType): Promise<PasswordResetTokenEntity> {
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

  async exists(credentials: PasswordCredentialsType): Promise<boolean> {
    return this.repository.exists(credentials);
  }
}
