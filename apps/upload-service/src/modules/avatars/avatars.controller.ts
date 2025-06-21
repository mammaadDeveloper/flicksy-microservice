import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from '../images/images.service';
import { join } from 'path';

@Controller({
  path: 'avatars',
  version: '1',
})
export class AvatarsController {
  constructor(private readonly imageService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('owner') owner?: string,
  ): Promise<unknown> {
    const image = await this.imageService.upload(file, {
      usage: 'avatar',
      path: join(__dirname, '..', '..', '..', 'uploads', 'avatars'),
      ownerId: owner,
      prefix: 'avatars',
    });
    return {
      statusCode: 201,
      status: 'CREATED',
      success: true,
      message: 'Image uploaded successfully',
      data: {
        attributes: image,
      },
    };
  }
}
