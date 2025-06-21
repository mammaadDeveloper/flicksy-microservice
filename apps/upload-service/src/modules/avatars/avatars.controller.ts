import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from '../images/images.service';
import { basename, join } from 'path';
import { createReadStream } from 'fs';
import { Response } from 'express';

@Controller({
  path: 'avatars',
  version: '1',
})
export class AvatarsController {
  constructor(private readonly imageService: ImagesService) {}

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const image = await this.imageService.findById(id);

    if (!image) {
      return res.status(404).json({
        statusCode: 404,
        status: 'NOT_FOUND',
        success: false,
        message: 'Image not found',
      });
    }

    const filePath = join(
      __dirname,
      '..',
      '..',
      '..',
      'uploads',
      'avatars',
      basename(image.path),
    );

    const stream = createReadStream(filePath);
    res.set({
      'Content-Type': image.mimetype,
      'Content-Disposition': `inline; filename="${image.filename}"`,
    });
    return stream.pipe(res);
  }

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
