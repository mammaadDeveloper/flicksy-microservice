import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ImagesService } from '../images/images.service';
import { ImageEntity } from '../images/entities/image.entity';
import { basename, join } from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AvatarsService {
  constructor(
    private readonly imageService: ImagesService,
    private readonly configService: ConfigService,
  ) {}

  async findImage(filename: string, id: string): Promise<ImageEntity> | never {
    const image = await this.imageService.lookupFile(filename, id);

    if (!image) throw new NotFoundException('Image not found');

    return image;
  }

  async upload(
    file: Express.Multer.File,
    owner?: string,
  ): Promise<{ imageId: string; filename: string; url: string }> {
    const image = await this.imageService.upload(file, {
      usage: 'avatar',
      path: join(__dirname, '..', '..', '..', 'uploads', 'avatars'),
      ownerId: owner,
      prefix: 'avatars',
    });

    if (!image) throw new InternalServerErrorException('Error uploading file');

    return {
      imageId: image.id,
      filename: image.filename,
      url: this.getAvatarUrl(image.filename, image.id),
    };
  }

  private getAvatarUrl(filename: string, id: string): string {
    return `${this.configService.get('app.static.url')}/avatars/${filename}?id=${id}`;
  }

  getAvatarPath(path: string): string {
    return join(
      __dirname,
      '..',
      '..',
      '..',
      'uploads',
      'avatars',
      basename(path),
    );
  }
}
