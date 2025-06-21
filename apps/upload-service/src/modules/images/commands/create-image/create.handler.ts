import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateImageCommand } from './create.command';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ImageEntity } from '../../entities/image.entity';

@CommandHandler(CreateImageCommand)
export class CreateImageHandler implements ICommandHandler<CreateImageCommand> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
  async execute(command: CreateImageCommand): Promise<ImageEntity | undefined> {
    const { filename, path, mimetype, size, usage, ownerId } = command;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const imageEntity = queryRunner.manager.create(ImageEntity, {
        filename,
        path,
        mimetype,
        size,
        usage,
        ownerId,
      });
      await queryRunner.manager.save(imageEntity);

      await queryRunner.commitTransaction();

      return imageEntity;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return undefined;
    } finally {
      await queryRunner.release();
    }
  }
}
