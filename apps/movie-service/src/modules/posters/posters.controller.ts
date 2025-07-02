import { Controller, Get, Param, Query } from '@nestjs/common';
import { PostersCoreService } from './services/core';
import { response } from 'src/shared';
import { PaginateDto, PaginationPipe } from 'src/common';

@Controller({
  version: '1',
  path: 'posters',
})
export class PostersController {
  constructor(private readonly service: PostersCoreService) {}

  @Get('all')
  async findAll(
    @Query(new PaginationPipe()) query: PaginateDto,
  ): Promise<unknown> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const posters = await this.service.findAll({ page, limit });
    const count = await this.service.count();
    const totalPages = Math.ceil(count / limit);

    return response({
      message: 'The list of posters was successfully received.',
      data: { type: 'posters', attributes: posters },
      meta: {
        page: {
          totalPages,
          totalItems: count,
          currentPage: page,
          perPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      links: {
        self: `/api/v1/posters/all?page=${page}&limit=${limit}`,
        next:
          page < totalPages
            ? `/api/v1/posters/all?page=${page + 1}&limit=${limit}`
            : null,
        perv:
          page > 1
            ? `/api/v1/posters/all?page=${page - 1}&limit=${limit}`
            : null,
        first: '/api/v1/posters/all?page=1&limit=' + limit,
        last: `/api/v1/posters/all?page=${totalPages}&limit=${limit}`,
      },
    });
  }

  @Get(':movie')
  async findByMovie(@Param('movie') movie: string): Promise<unknown> {
    const posters = await this.service.findByMovieSlug(movie);

    return response({
      message:
        'Poster information was successfully retrieved according to the movie.',
      data: { type: 'poster by movie', attributes: posters },
    });
  }
}
