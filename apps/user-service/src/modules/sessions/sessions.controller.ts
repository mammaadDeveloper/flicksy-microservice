import {
  Controller,
  Get,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Version,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CoreSessionService } from './services/core.service';
import { response } from 'src/shared';
import { GetUser } from 'src/common';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { SessionQueryDto } from './dto/session-query.dto';
import { GetUserType } from 'src/shared/types/user.type';

@Controller('sessions')
@UseGuards(JwtAccessGuard)
export class SessionsController {
  constructor(private readonly sessionsService: CoreSessionService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: GetUserType, @Query() query: SessionQueryDto) {

    console.log('controller', query);
    
    const sessions = await this.sessionsService.findAll(user.id, query);

    return response({
      message: 'Session list fetched successfully',
      data:{
        type: 'session list',
        attributes: sessions,
      },
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
