import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { response } from 'src/shared';
import { GetUser } from 'src/common';
import { GetUserType } from 'src/shared/types/user.type';
import { UsersService } from '../users/users.service';
import { CreateProfileDto, UpdateProfileDto } from './dto';

@Controller('profile')
@UseGuards(JwtAccessGuard)
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async profileInfo(@GetUser() user: GetUserType) {
    const userFormatted = await this.usersService.findWithFormat(user.id);
    const profile = await this.profileService.getProfileInfo(user.id);

    return response({
      message: `Profile information's successfully received`,
      data: {
        type: 'profile info',
        attributes: profile,
        relationships: userFormatted,
      },
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async storeProfileInfo(
    @GetUser() user: GetUserType,
    @Body() body: CreateProfileDto,
  ) {
    const userRelation = await this.usersService.find(user.id);
    const profile = await this.profileService.storeProfileInfo(
      userRelation,
      body,
    );

    return response({
      message: `Profile information's has been registered`,
      status: 'CREATED',
      data: {
        type: 'create profile',
        attributes: profile,
        relationships: userRelation,
      },
    });
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async updateProfileInfo(
    @GetUser() user: GetUserType,
    @Body() body: UpdateProfileDto,
  ) {
    const result = await this.profileService.updateProfileInfo(user.id, body);
    const userFormatted = await this.usersService.findWithFormat(user.id);

    return response({
      message: 'Profile updated successfully',
      data: {
        type: 'update profile',
        attributes: result,
        relationships: userFormatted,
      },
    });
  }

  @Patch('avatar')
  async updateAvatar(
    @GetUser() user: GetUserType,
    @Body('avatar') avatar: string,
  ) {
    const result = await this.profileService.updateAvatar(user.id, avatar);

    return response({
      message: 'Profile avatar updated successfully',
      data: {
        type: 'update avatar',
        attributes: result,
      },
    });
  }
}
