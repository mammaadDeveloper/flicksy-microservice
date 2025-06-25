import { response } from 'src/shared';

/* eslint-disable no-constant-binary-expression */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CoreMoviesService } from './services/core';
import { UpdateMovieDto } from './dto/update.dto';
import { GetMoviesWithPaginateDto } from './dto/movies.dto';
import { CreateMovieDto } from './dto/create.dto';
import { PaginationPipe } from 'src/common';

@Controller({
  version: '1',
  path: 'movies',
})
export class MoviesController {
  constructor(private readonly service: CoreMoviesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query(new PaginationPipe()) options: GetMoviesWithPaginateDto,
  ): Promise<unknown> {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;

    const movies = await this.service.findAll({
      ...options,
      page,
      limit,
    });
    const count = await this.service.count();
    const totalPages = Math.ceil(count / limit);

    return response({
      message: 'Movie list information was successfully received.',
      data: { type: 'movies', attributes: movies },
      meta: {
        currentPage: options.page,
        itemCount: options.limit,
        totalItems: count,
        totalPages,
      },
      links: {
        self: `/api/v1/movies?page=${page}`,
        next: page < totalPages ? `/api/v1/movies?page=${page + 1}` : null,
        perv: page > 1 ? `/api/v1/movies?page=${page - 1}` : null,
      },
    });
  }

  @Get(':slug')
  async find(
    @Param('slug', new ParseUUIDPipe({ version: '4' })) slug: string,
  ): Promise<unknown> {
    const movie = await this.service.findOne(slug);

    return response({
      message: 'The movie information was successfully retrieved.',
      data: { type: 'movie', attributes: movie },
    });
  }

  @Post()
  async createMovie(@Body() body: CreateMovieDto): Promise<unknown> {
    const movie = await this.service.createMovie(body);

    return response({
      message: 'The movie information was successfully recorded.',
      data: { type: 'create movie', attributes: movie },
    });
  }

  @Patch(':slug')
  async updateMovie(
    @Param('slug', ParseUUIDPipe) slug: string,
    @Body() body: UpdateMovieDto,
  ): Promise<unknown> {
    const result = await this.service.updateMovie(slug, body);

    return response({
      message: 'Movie updated successfully.',
      data: { type: 'update movie', attributes: result },
    });
  }
}
