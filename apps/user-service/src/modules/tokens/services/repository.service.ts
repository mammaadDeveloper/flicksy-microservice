import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTokenCommandDto } from '../dto/token.dto';
import { CreateTokenCommand } from '../commands/create-token/create-token.command';
import { RevokeByJtiCommand } from '../commands/revoke-by-jti/revoke-by-jti.command';
import { FindByJtiQuery } from '../queries/find-by-jti/find-by-jti.query';
import { PersonalAccessEntity } from '../entities/token.entity';
import { DeleteExpiredTokensCommand, DeleteRevokedTokensCommand } from '../commands';

@Injectable()
export class TokenRepositoryService {
    constructor(
        private readonly command: CommandBus,
        private readonly query: QueryBus,
    ){}

    async create(dto: CreateTokenCommandDto): Promise<PersonalAccessEntity>{
        return await this.command.execute(new CreateTokenCommand(dto));
    }
    async revoke(jti: string): Promise<PersonalAccessEntity>{
        return await this.command.execute(new RevokeByJtiCommand(jti));
    }

    async findByJti(jti: string): Promise<PersonalAccessEntity>{
        return await this.query.execute(new FindByJtiQuery(jti));
    }

    async deleteRevoked(): Promise<void>{
        await this.command.execute(new DeleteRevokedTokensCommand());
    }

    async deleteExpired(): Promise<void>{
        await this.command.execute(new DeleteExpiredTokensCommand());
    }
}