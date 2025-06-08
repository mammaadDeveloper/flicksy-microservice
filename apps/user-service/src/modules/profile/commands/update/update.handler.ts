import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProfileCommand } from './update.command';
import { DataSource } from 'typeorm';
import { ProfileEntity } from '../../entities/profile.entity';
import { InjectDataSource } from '@nestjs/typeorm';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileCommandHandler
  implements ICommandHandler<UpdateProfileCommand>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
  async execute(
    command: UpdateProfileCommand,
  ): Promise<ProfileEntity> {
    const { userId, data } = command;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const profile = await queryRunner.manager.findOne(ProfileEntity, {
        where: { user: { id: userId } },
        relations: ['user']
      });

      if(!profile)
        throw new Error('Profile not found');

      Object.assign(profile, data);

      await queryRunner.manager.save(profile);

      await queryRunner.commitTransaction();

      return profile;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
