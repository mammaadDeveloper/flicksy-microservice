import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { CoreMoviesService } from './services/core';
import { GetMoviesWithPaginateDto } from './dto/movies.dto';
import { response } from 'src/shared';

@Controller({
  version: '1',
  path: 'movies',
})
export class MoviesController {
  constructor(private readonly service: CoreMoviesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() options: GetMoviesWithPaginateDto) {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;

    const movies = await this.service.findAll({ ...options, page, limit });

    return response({
      message: 'Movie list information was successfully received.',
      data: { type: 'movies', attributes: movies },
      meta: {
        currentPage: page,
        itemCount: limit,
        totalItems: 0,
      },
      links: {
        self: `/movies?page=${options.page}`,
        next: `/movies?page=${options.page + 1}`,
        perv: `/movies?page=${options.page - 1}`,
      },
    });
  }

  @Get(':slub')
  async find(
    @Param('slug', new ParseUUIDPipe({ version: '4' })) slug: string,
  ) {}
}
