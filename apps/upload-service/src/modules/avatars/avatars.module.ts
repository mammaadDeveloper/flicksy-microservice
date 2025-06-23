import { Module } from '@nestjs/common';

import { AvatarsService } from './avatars.service';
import { AvatarsController } from './avatars.controller';
import { ImagesModule } from '../images/images.module';

@Module({
  imports: [ImagesModule],
  controllers: [AvatarsController],
  providers: [AvatarsService],
})
export class AvatarsModule {}
