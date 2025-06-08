import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { ProfileService } from './profile.service';
import { ProfileRepository } from './services/repository';
import { GetProfileByUserQueryHandler } from './queries';
import { UsersModule } from '../users/users.module';
import { CreateProfileCommandHandler, UpdateProfileCommandHandler } from './commands';
import { ProfileController } from './profile.controller';

const commands = [CreateProfileCommandHandler, UpdateProfileCommandHandler];

const queries = [GetProfileByUserQueryHandler];

@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity]), UsersModule],
  controllers: [ProfileController],
  providers: [...commands, ...queries, ProfileService, ProfileRepository],
  exports: [ProfileService],
})
export class ProfileModule {}
