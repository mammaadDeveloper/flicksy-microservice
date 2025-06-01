import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { PasswordResetTokenType } from 'src/shared/types/token.type';
import { v4 as uuidV4 } from 'uuid';
import {
  CreatePasswordResetTokenCommand,
  UseResetTokenCommand,
} from '../commands';
import * as dayjs from 'dayjs';
import { FindResetTokenQuery } from '../queries/find-reset-token/find-reset-token.query';

@Injectable()
export class PasswordRestService {
  constructor(
    private readonly command: CommandBus,
    private readonly query: QueryBus,
  ) {}

  async generateResetToken(
    user: UserEntity,
    type: PasswordResetTokenType,
  ): Promise<string> {
    const tokenOrCode: string =
      type === PasswordResetTokenType.CODE
        ? Math.floor(100000 + Math.random() * 900000).toString()
        : uuidV4();

    await this.command.execute(
      new CreatePasswordResetTokenCommand(
        user,
        tokenOrCode,
        type,
        dayjs().add(15, 'minute').toDate(),
      ),
    );

    return tokenOrCode;
  }

  async verifyResetToken(
    user: UserEntity,
    token: string,
    type: PasswordResetTokenType,
  ): Promise<UserEntity> {
    return await this.command.execute(
      new UseResetTokenCommand(user, token, type),
    );
  }
}
