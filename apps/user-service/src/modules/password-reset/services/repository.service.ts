import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { PasswordResetTokenType } from 'src/shared/types/token.type';
import { v4 as uuidV4 } from 'uuid';
import {
  CreatePasswordResetTokenCommand,
  ResetPasswordCommand,
  UseResetTokenCommand,
} from '../commands';
import * as dayjs from 'dayjs';
import { PasswordResetTokenEntity } from '../entities/password.entity';

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
    user: UserEntity,
    token: string,
    type: PasswordResetTokenType,
  ): Promise<UserEntity> {
    return await this.command.execute(
      new UseResetTokenCommand(user, token, type),
    );
  }

  async changeUserPassword(id: number, newPassword: string): Promise<void> {
    await this.command.execute(
      new ResetPasswordCommand(id, newPassword),
    );
  }
}
