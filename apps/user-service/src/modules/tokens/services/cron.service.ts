import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { TokenRepositoryService } from "./repository.service";
import { AppLoggerService } from "src/shared/utils/logger/logger.service";

@Injectable()
export class CronTokensService{
    constructor(
        private readonly repository: TokenRepositoryService,
        private readonly logger: AppLoggerService
    ){
        logger.setContext('Token Cron Job');
    }

    @Cron(CronExpression.EVERY_12_HOURS)
    async deleteRevokedTokens(){
        try{
            await this.repository.deleteRevoked();
            this.logger.log('Revoked tokens deleted successfully');
        }
        catch(error){
            this.logger.error('Failed to delete revoked tokens', error.message);
        }
    }

    @Cron(CronExpression.EVERY_WEEKEND)
    async deleteExpiredTokens(){
        try{
            await this.repository.deleteExpired();
            this.logger.log('Expired tokens deleted successfully');
        }
        catch(error){
            this.logger.error('Failed to delete expired tokens', error.message);
            throw error
        }
    }
}