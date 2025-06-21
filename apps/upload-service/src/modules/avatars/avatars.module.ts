import { Module } from '@nestjs/common';
import { AvatarsController } from './avatars.controller';
import { ImagesModule } from '../images/images.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ImagesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../uploads/avatars'),
      serveRoot: '/avatars',
    }),
  ],
  controllers: [AvatarsController],
})
export class AvatarsModule {}
