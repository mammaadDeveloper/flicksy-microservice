import * as dayjs from 'dayjs';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { PasswordCredentialsType } from 'src/shared/types/password-reset.type';
import { PasswordResetTokenType } from 'src/shared/types/token.type';

import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
    CreatePasswordResetTokenCommand, ResetPasswordCommand, UseResetTokenCommand
} from '../commands';
import { PasswordResetTokenEntity } from '../entities/password.entity';
import { ExistsResetTokenQuery, FindResetTokenQuery } from '../queries';
import { CheckAvailableQuery } from '../queries/check-available/check-available.query';

@Injectable()
export class PasswordRepositoryService {
  constructor(
    private readonly command: CommandBus,
    private readonly query: QueryBus,
  ) {}

  async create(
    user: UserEntity,
    type: PasswordResetTokenType,
    token: string | null,
  ): Promise<PasswordResetTokenEntity> {
    return await this.command.execute(
      new CreatePasswordResetTokenCommand(
        user,
        token,
        type,
        dayjs().add(15, 'minute').toDate(),
      ),
    );
  }

  async setUsed(
    userId: number,
    token: string,
    type: PasswordResetTokenType,
  ): Promise<boolean> {
    try {
      await this.command.execute(new UseResetTokenCommand(userId, token, type));
      return true;
    } catch (error) {
      throw error;
    }
  }

  async changeUserPassword(id: number, newPassword: string): Promise<void> {
    await this.command.execute(new ResetPasswordCommand(id, newPassword));
  }

  async find(credentials: PasswordCredentialsType) {
    return await this.query.execute(
      new FindResetTokenQuery(
        credentials.user,
        credentials.token,
        credentials.type,
      ),
    );
  }

  async exists(credentials: PasswordCredentialsType) {
    return this.query.execute(new ExistsResetTokenQuery(credentials));
  }

  async check(userId: number): Promise<boolean> {
    return await this.query.execute(new CheckAvailableQuery(userId));
  }
}
