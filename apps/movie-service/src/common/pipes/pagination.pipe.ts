/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class PaginationPipe implements PipeTransform {
  private readonly MAX_LIMIT = 100;
  transform(
    value: any,
    _metadata: ArgumentMetadata,
  ): { page: number; limit: number } {
    let page = Number(value?.page) || 1;
    let limit = Number(value?.limit) || 10;

    page = Math.max(1, Math.floor(page));
    limit = Math.min(this.MAX_LIMIT, Math.max(1, Math.floor(limit)));

    if (isNaN(page) || isNaN(limit))
      throw new BadRequestException('Pagination params must be numeric');

    return {
      page,
      limit,
    };
  }
}
