import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePasswordResetTokenCommand } from './create-reset-token.command';
import { PasswordResetTokenEntity } from '../../entities/password.entity';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';

@CommandHandler(CreatePasswordResetTokenCommand)
export class CreatePasswordResetTokenCommandHandler
  implements ICommandHandler<CreatePasswordResetTokenCommand>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
  async execute(
    command: CreatePasswordResetTokenCommand,
  ): Promise<PasswordResetTokenEntity> {
    const { user, token, type, expiredAt } = command;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const repo = queryRunner.manager.getRepository(PasswordResetTokenEntity);

      const passwordEntity = repo.create({
        token,
        user,
        expiredAt,
        type,
      });
      await repo.save(passwordEntity);

      await queryRunner.commitTransaction();

      return passwordEntity;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException({
        message: 'Failed to create password reset token',
        error,
      });
    } finally {
      await queryRunner.release();
    }
  }
}
