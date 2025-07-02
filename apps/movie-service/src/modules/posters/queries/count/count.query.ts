import { Query } from '@nestjs/cqrs';

export class PosterCountQuery extends Query<number> {}
