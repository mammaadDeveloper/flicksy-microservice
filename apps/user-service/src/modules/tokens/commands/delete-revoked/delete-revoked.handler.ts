import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteRevokedTokensCommand } from "./delete-revoke.command";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { PersonalAccessEntity } from "../../entities/token.entity";

@CommandHandler(DeleteRevokedTokensCommand)
export class DeleteRevokedTokensCommandHandler implements ICommandHandler<DeleteRevokedTokensCommand>{
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource
    ){
    }

    async execute(command: DeleteRevokedTokensCommand): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            const tokens = await queryRunner.manager.find(PersonalAccessEntity, {where: {isRevoked: true}});

            await queryRunner.manager.remove(tokens);

            await queryRunner.commitTransaction();
        }
        catch(error){
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally{
            await queryRunner.release();
        }
    }
}