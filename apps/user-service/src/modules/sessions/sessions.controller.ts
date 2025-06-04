import {
  Controller,
  Get,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const data = await this.sessionsService.findAll();

    return {
      statusCode: HttpStatus.OK,
      status: 'OK',
      success: true,
      message: 'Session list fetched successfully',
      data,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const data = await this.sessionsService.findOne(id);

    return {
      statusCode: HttpStatus.OK,
      status: 'OK',
      success: true,
      message: 'Session fetched successfully',
      data
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.sessionsService.remove(id, '');
  }
}
