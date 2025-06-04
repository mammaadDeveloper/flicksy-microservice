import { ICommand, Query } from "@nestjs/cqrs";

export class DeleteExpiredSessionCommand extends Query<number> implements ICommand{}