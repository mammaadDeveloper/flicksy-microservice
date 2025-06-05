import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTokenCommand } from './create-token.command';
import { PersonalAccessEntity } from '../../entities/token.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { AppLoggerService } from 'src/shared/utils/logger/logger.service';
import { error } from 'console';

@CommandHandler(CreateTokenCommand)
export class CreateTokenCommandHandler
  implements ICommandHandler<CreateTokenCommand>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly logger: AppLoggerService
  ) {
    logger.setContext(CreateTokenCommandHandler.name);
  }

  async execute(command: CreateTokenCommand): Promise<PersonalAccessEntity> {
    const { dto } = command;
    const { token, user, type, expiredAt, isRevoked, jti, parent } = dto;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const repo = queryRunner.manager.getRepository(PersonalAccessEntity);

      const tokenEntity = repo.create({
        token,
        user,
        type,
        expiredAt,
        isRevoked,
        jti,
      });
      if(parent)
        tokenEntity.parent = parent;
    
      await repo.save(tokenEntity);
      
      await queryRunner.commitTransaction();

      this.logger.log('Refresh token created successfully');
      
      return tokenEntity;
    } catch (err) {
        await queryRunner.rollbackTransaction();
        this.logger.error('Failed to create refresh token', err.message);
        throw err;
    } finally {
        await queryRunner.release();
    }
  }
}
