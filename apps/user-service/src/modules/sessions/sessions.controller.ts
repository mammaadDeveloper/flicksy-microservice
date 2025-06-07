import {
  Controller,
  Get,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Version,
  UseGuards,
} from '@nestjs/common';
import { CoreSessionService } from './services/core.service';
import { response } from 'src/shared';
import { GetUser } from 'src/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: CoreSessionService) {}

  @Get()
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: {userId: number}) {
    const data = await this.sessionsService.findAll(user.userId);

    return response({
      message: 'Session list fetched successfully',
      data:{
        type: 'session list',
        attributes: data,
      },
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') sessionId: string) {
    const {id, instance} = await this.sessionsService.findOne(sessionId);

    return response({
      message: 'Session fetched successfully',
      data:{
        type: 'session',
        id: id,
        attributes: instance,
        relationships: []
      },
      meta: {
        previous: ''
      }
    });
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
