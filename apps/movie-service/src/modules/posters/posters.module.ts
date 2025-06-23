import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PosterEntity } from './entities/posters.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PosterEntity])]
})
export class PostersModule {}
