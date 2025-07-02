import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CoreSources } from './services/core';
import { response } from 'src/shared';
import { CreateSourceDto } from './dto/create-source.dto';

@Controller({ version: '1', path: 'sources' })
export class SourcesController {
  constructor(private readonly service: CoreSources) {}

  @Get(':movie')
  async findByMovie(
    @Param('movie', ParseUUIDPipe) movie: string,
  ): Promise<unknown> {
    const sources = await this.service.findSourcesByMovieSlug(movie);

    return response({
      message:
        'The list of sources according to the movie was successfully received.',
      data: { type: 'find sources by movie', attributes: sources },
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateSourceDto): Promise<unknown> {
    const source = await this.service.createSource(body);

    return response({
      message: 'The movie source information was successfully registered.',
      data: { type: 'create source', attributes: source },
    });
  }
}
