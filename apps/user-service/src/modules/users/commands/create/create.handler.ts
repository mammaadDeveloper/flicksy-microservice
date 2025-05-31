import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "./create.command";
import { UserEntity } from "../../entities/user.entity";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import * as dayjs from 'dayjs';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand>{
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource
    ){}
    async execute(command: CreateUserCommand): Promise<UserEntity> {
        const {data} = command;

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try{
            const repo = queryRunner.manager.getRepository(UserEntity);
            
            const user = repo.create({...data});
            await repo.save(user);
            
            await queryRunner.commitTransaction();
            
            return user;
        }
        catch(err){
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally{
            await queryRunner.release();
        }
    }

}