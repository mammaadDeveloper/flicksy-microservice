import { Command, ICommand } from "@nestjs/cqrs";

export class DeleteExpiredTokensCommand extends Command<void> implements ICommand{}