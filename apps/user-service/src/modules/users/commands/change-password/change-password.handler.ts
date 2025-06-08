import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangePasswordCommand } from './change-password.command';
import { UserEntity } from '../../entities/user.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppLoggerService } from 'src/shared';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordCommandHandler
  implements ICommandHandler<ChangePasswordCommand>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly logger: AppLoggerService
  ) {
    logger.setContext(ChangePasswordCommandHandler.name);
  }
  async execute(command: ChangePasswordCommand): Promise<UserEntity> {
    const { user, password } = command;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
        user.password = password;
        await queryRunner.manager.save(user);
        
        await queryRunner.commitTransaction();

        this.logger.log('Password updated successfully');

        return user;
    }
    catch(error){
        await queryRunner.rollbackTransaction();

        this.logger.error('Failed to update password', error.message);
        
        throw error;
    }
    finally{
        await queryRunner.release();
    }
  }
}
