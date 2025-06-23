import { v4 as uuidV4 } from 'uuid';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';

import { FindByIdQuery, FindImageByFileAndIdQuery } from './queries';
import { ImageEntity } from './entities/image.entity';
import { CreateImageCommand } from './commands';

@Injectable()
export class ImagesService {
  constructor(
    private readonly command: CommandBus,
    private readonly query: QueryBus,
  ) {}
  async upload(
    file: Express.Multer.File,
    options: {
      path?: string;
      prefix?: string;
      usage?: string;
      ownerId?: string;
    } = {},
  ): Promise<ImageEntity | undefined> {
    const uploadDir = options.path ?? join(__dirname, '../../../uploads');
    if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

    const fileName = `${uuidV4()}-${file.originalname}`;
    const filePath = join(uploadDir, fileName);
    writeFileSync(filePath, file.buffer);

    const image = await this.command.execute(
      new CreateImageCommand(
        fileName,
        filePath,
        file.mimetype,
        file.size,
        options.usage ?? 'image',
        options.ownerId !== undefined ? String(options.ownerId) : undefined,
      ),
    );

    return image;
  }

  async findById(id: string): Promise<ImageEntity | null> {
    return await this.query.execute(new FindByIdQuery(id));
  }

  async lookupFile(filename: string, id: string): Promise<ImageEntity | null> {
    return await this.query.execute(
      new FindImageByFileAndIdQuery(filename, id),
    );
  }
}
