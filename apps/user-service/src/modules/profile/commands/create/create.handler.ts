import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProfileCommand } from './create.command';
import { ProfileEntity } from '../../entities/profile.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BadRequestException, Logger } from '@nestjs/common';
import { AppLoggerService } from 'src/shared';

@CommandHandler(CreateProfileCommand)
export class CreateProfileCommandHandler
  implements ICommandHandler<CreateProfileCommand>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly logger: AppLoggerService,
  ) {
    logger.setContext(CreateProfileCommandHandler.name);
  }
  async execute(command: CreateProfileCommand): Promise<ProfileEntity> {
    const { user, data } = command;

    if(!Object.values(data).some((v) => v !== undefined && v !== null))
      throw new BadRequestException('At least one of the profile fields must be entered.');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entity = queryRunner.manager.create(ProfileEntity, {
        user,
        ...data,
      });
      const profile = await queryRunner.manager.save(entity);

      await queryRunner.commitTransaction();

      this.logger.log('Profile created successfully');

      return profile;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to create profile', error.message);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
