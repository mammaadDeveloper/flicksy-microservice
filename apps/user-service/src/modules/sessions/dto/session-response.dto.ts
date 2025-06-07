import { Exclude, Expose } from "class-transformer";
import { SessionEntity } from "../entities/session.entity";

@Exclude()
export class SessionOutDto{
    @Exclude({toPlainOnly: true})
    id: string;

    @Expose({name: 'jti'})
    token: string;

    @Expose({name: 'ipAddress'})
    ip: string;

    @Expose({name: 'userAgent'})
    user_agent: string;

    @Expose({name: 'loggedInAt'})
    logged_in: Date;

    @Expose({name: 'loggedOutAt'})
    logged_out: Date;

    @Expose({name: 'expiredAt'})
    expire: Date;

    constructor(session: Partial<SessionEntity>){
        Object.assign(this, session);
    }
}