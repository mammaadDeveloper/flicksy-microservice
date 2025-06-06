import { Command, ICommand } from "@nestjs/cqrs";

export class DeleteRevokedTokensCommand extends Command<void> implements ICommand{}