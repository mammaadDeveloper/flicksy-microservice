import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateTokenCommandHandler } from './commands/create-token/create-token.handler';
import { RevokeByJtiCommandHandler } from './commands/revoke-by-jti/revoke-by-jti.handler';
import { PersonalAccessEntity } from './entities/token.entity';
import { FindByJtiQueryHandler } from './queries/find-by-jti/find-by-jti.handler';
import { TokenRepositoryService } from './services/repository.service';
import { TokensService } from './tokens.service';

const commands = [
  CreateTokenCommandHandler,
  RevokeByJtiCommandHandler,
];

const queries = [FindByJtiQueryHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([PersonalAccessEntity]),
    JwtModule.register({}),
  ],
  providers: [...commands, ...queries, TokensService, TokenRepositoryService],
  exports: [TokensService],
})
export class TokensModule {}
