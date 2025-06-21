import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { ImagesService } from './images.service';
import { CreateImageHandler } from './commands';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  providers: [CreateImageHandler, ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
