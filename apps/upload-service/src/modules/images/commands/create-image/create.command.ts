import { Command } from '@nestjs/cqrs';
import { ImageEntity } from '../../entities/image.entity';

export class CreateImageCommand extends Command<ImageEntity | undefined> {
  constructor(
    public readonly filename: string,
    public readonly path: string,
    public readonly mimetype: string,
    public readonly size: number,
    public readonly usage: string,
    public readonly ownerId?: string,
  ) {
    super();
  }
}
