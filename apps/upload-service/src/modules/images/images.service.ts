/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { v4 as uuidV4 } from 'uuid';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';

import { CreateImageCommand } from './commands';

@Injectable()
export class ImagesService {
  constructor(
    private readonly command: CommandBus,
    private readonly configService: ConfigService,
  ) {}
  async upload(
    file: Express.Multer.File,
    options: {
      path?: string;
      prefix?: string;
      usage?: string;
      ownerId?: string;
    } = {},
  ): Promise<unknown> {
    const uploadDir = options.path ?? join(__dirname, '../../../uploads');
    if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

    const fileName = `${uuidV4()}-${file.originalname}`;
    const filePath = join(uploadDir, fileName);
    writeFileSync(filePath, file.buffer);

    const trimmedPrefix = (options.prefix || '')
      .trim()
      .replace(/^\/+|\/+$/g, '');

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

    return {
      id: image?.id,
      filename: image?.filename,
      mimetype: image?.mimetype,
      size: image?.size,
      url: `${this.configService.get('app.static.url')}${trimmedPrefix ? `/${trimmedPrefix}/` : '/'}${image?.filename}`,
    };
  }
}
