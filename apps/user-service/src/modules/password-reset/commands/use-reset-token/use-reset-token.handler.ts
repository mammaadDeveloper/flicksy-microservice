import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UseResetTokenCommand } from './use-reset-token.command';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PasswordResetTokenEntity } from '../../entities/password.entity';
import { AppLoggerService } from 'src/shared/utils/logger/logger.service';

@CommandHandler(UseResetTokenCommand)
export class UseResetTokenCommandHandler
  implements ICommandHandler<UseResetTokenCommand>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly logger: AppLoggerService
  ) {
    logger.setContext(UseResetTokenCommandHandler.name);
  }
  async execute(command: UseResetTokenCommand): Promise<void> {
    const { userId, token, type } = command;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const repo = queryRunner.manager.getRepository(PasswordResetTokenEntity);

      const passwordEntity = await repo.findOne({
        where: { user: {id: userId}, token, type, isUsed: false },
        relations: ['user'],
      });
      if (!passwordEntity) {
        throw new NotFoundException({
          message: 'Password reset token not found or already used',
        });
      }
      if (new Date() > passwordEntity.expiredAt)
        throw new UnauthorizedException('Token has expired');

      passwordEntity.isUsed = true;
      await repo.save(passwordEntity);

      await queryRunner.commitTransaction();

      this.logger.log('Set used for password reset token successfully');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to set used password reset token', error.message);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
