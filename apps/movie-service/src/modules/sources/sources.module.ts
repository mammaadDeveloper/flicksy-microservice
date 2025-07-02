import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceEntity } from './entities/sources.entity';
import { CreateSourceHandler } from './commands';
import { SourcesService } from './sources.service';
import { SourcesRepository } from './services/repository';
import { CoreSources } from './services/core';
import { SourcesController } from './sources.controller';
import { MoviesModule } from '../movies/movies.module';
import { FindSourceByMovieSlugHandler } from './queries';

const commands = [CreateSourceHandler];

const queries = [FindSourceByMovieSlugHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([SourceEntity]),
    forwardRef(() => MoviesModule),
  ],
  controllers: [SourcesController],
  providers: [
    ...commands,
    ...queries,
    SourcesService,
    SourcesRepository,
    CoreSources,
  ],
  exports: [SourcesService],
})
export class SourcesModule {}
