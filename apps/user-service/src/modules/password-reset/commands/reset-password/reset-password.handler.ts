import { DataSource } from 'typeorm';

import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';

import { UserEntity } from '../../../users/entities/user.entity';
import { ResetPasswordCommand } from './reset-password.command';
import { AppLoggerService } from 'src/shared/utils/logger/logger.service';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordCommandHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly logger: AppLoggerService
  ) {
    logger.setContext(ResetPasswordCommandHandler.name);
  }
  async execute(command: ResetPasswordCommand): Promise<void> {
    const { id, newPassword } = command;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const repo = queryRunner.manager.getRepository(UserEntity);

      const userEntity = await repo.findOne({ where: { id } });
      if (!userEntity) throw new NotFoundException('User not found');

      userEntity.password = newPassword;
      await repo.save(userEntity);

      await queryRunner.commitTransaction();

      this.logger.log('User password reseed successfully');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to reset password', error.message);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
