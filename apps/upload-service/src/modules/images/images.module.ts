import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { ImagesService } from './images.service';
import { CreateImageHandler } from './commands';
import { FindByIdHandler } from './queries';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  providers: [CreateImageHandler, FindByIdHandler, ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
