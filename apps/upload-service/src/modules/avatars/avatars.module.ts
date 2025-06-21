import { Module } from '@nestjs/common';
import { AvatarsController } from './avatars.controller';
import { ImagesModule } from '../images/images.module';

@Module({
  imports: [ImagesModule],
  controllers: [AvatarsController],
})
export class AvatarsModule {}
