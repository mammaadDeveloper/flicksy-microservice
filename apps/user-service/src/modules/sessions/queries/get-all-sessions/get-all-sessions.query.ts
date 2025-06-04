import { IQuery, Query } from "@nestjs/cqrs";
import { SessionEntity } from "../../entities/session.entity";

export class GetAllSessionsQuery extends Query<SessionEntity[]> implements IQuery{}