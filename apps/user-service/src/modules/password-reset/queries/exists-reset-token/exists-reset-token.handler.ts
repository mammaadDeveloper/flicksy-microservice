import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ExistsResetTokenQuery } from "./exists-reset-token.command";
import { Repository } from "typeorm";
import { PasswordResetTokenEntity } from "../../entities/password.entity";
import { InjectRepository } from "@nestjs/typeorm";

@QueryHandler(ExistsResetTokenQuery)
export class ExistsResetTokenQueryHandler implements IQueryHandler<ExistsResetTokenQuery>{
    constructor(
        @InjectRepository(PasswordResetTokenEntity)
        private readonly repository: Repository<PasswordResetTokenEntity>
    ){}
    execute(query: ExistsResetTokenQuery): Promise<boolean> {
        const {credentials} = query;
        const {token, type, user} = credentials;
        return this.repository.exists({where: {token, type, user}});
    }

}