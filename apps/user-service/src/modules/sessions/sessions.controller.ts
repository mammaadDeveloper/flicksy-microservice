import {
  Controller,
  Get,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Version,
} from '@nestjs/common';
import { CoreSessionService } from './services/core.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: CoreSessionService) {}

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
      data,
    };
  }

  @Delete(':token')
  @Version('1')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('token') token: string) {
    await this.sessionsService.remove(token);
  }

  @Delete(':token/leave')
  @Version('1')
  @HttpCode(HttpStatus.NO_CONTENT)
  async leaveCurrent(@Param('token') token:string){
    await this.sessionsService.leaveCurrent(token);
  }
}
