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

@CommandHandler(UseResetTokenCommand)
export class UseResetTokenCommandHandler
  implements ICommandHandler<UseResetTokenCommand>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
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
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
