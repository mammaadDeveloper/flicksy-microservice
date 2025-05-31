import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalAccessEntity } from './entities/token.entity';
import { TokensService } from './tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { TokenRepositoryService } from './services/repository.service';
import { CreateTokenCommandHandler } from './commands/create-token/create-token.handler';
import { RevokeByJtiCommandHandler } from './commands/revoke-by-jti/revoke-by-jti.handler';
import { FindByJtiQueryHandler } from './queries/find-by-jti/find-by-jti.handler';

const commands = [CreateTokenCommandHandler, RevokeByJtiCommandHandler];
const queries = [FindByJtiQueryHandler];
@Module({
  imports: [
    TypeOrmModule.forFeature([PersonalAccessEntity]),
    JwtModule.register({}),
  ],
  providers: [TokensService, TokenRepositoryService, ...commands, ...queries],
  exports: [TokensService],
})
export class TokensModule {}
