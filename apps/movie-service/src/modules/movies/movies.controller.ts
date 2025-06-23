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
    const count = await this.service.count();
    const totalPages = Math.ceil(count / limit);

    return response({
      message: 'Movie list information was successfully received.',
      data: { type: 'movies', attributes: movies },
      meta: {
        currentPage: page,
        itemCount: limit,
        totalItems: count,
        totalPages,
      },
      links: {
        self: `/movies?page=${page}`,
        next: page < totalPages ? `/movies?page=${page + 1}` : null,
        perv: page > 1 ? `/movies?page=${page - 1}` : null,
      },
    });
  }

  @Get(':slub')
  async find(
    @Param('slug', new ParseUUIDPipe({ version: '4' })) slug: string,
  ) {}
}
