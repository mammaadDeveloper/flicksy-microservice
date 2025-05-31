import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTokenCommand } from './create-token.command';
import { PersonalAccessEntity } from '../../entities/token.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@CommandHandler(CreateTokenCommand)
export class CreateTokenCommandHandler
  implements ICommandHandler<CreateTokenCommand>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

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
      
      return tokenEntity;
    } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
    } finally {
        await queryRunner.release();
    }
  }
}
