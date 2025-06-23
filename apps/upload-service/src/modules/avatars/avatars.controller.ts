import { createReadStream } from 'fs';
import { Response } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
  Version,
} from '@nestjs/common';

import { AvatarsService } from './avatars.service';

@Controller('avatars')
export class AvatarsController {
  constructor(private readonly avatarService: AvatarsService) {}

  @Get(':filename')
  async findOne(
    @Param('filename', ParseFilePipe) filename: string,
    @Query('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const image = await this.avatarService.findImage(filename, id);

    const filePath = this.avatarService.getAvatarPath(image.path);

    const stream = createReadStream(filePath);
    res.set({
      'Content-Type': image.mimetype,
      'Content-Disposition': `inline; filename="${image.filename}"`,
    });
    return stream.pipe(res);
  }

  @Post('upload')
  @Version('1')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('owner') owner?: string,
  ): Promise<unknown> {
    const result = await this.avatarService.upload(file, owner);

    return {
      statusCode: 201,
      status: 'CREATED',
      success: true,
      message: 'Image uploaded successfully',
      data: {
        attributes: result,
      },
    };
  }
}
