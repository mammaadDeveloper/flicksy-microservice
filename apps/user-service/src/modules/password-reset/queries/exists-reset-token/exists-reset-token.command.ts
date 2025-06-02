import { IQuery, Query } from "@nestjs/cqrs";
import { PasswordCredentialsType } from "src/shared/types/password-reset.type";

export class ExistsResetTokenQuery extends Query<boolean> implements IQuery{
    constructor(
        public readonly credentials: PasswordCredentialsType){
        super();
    }
}