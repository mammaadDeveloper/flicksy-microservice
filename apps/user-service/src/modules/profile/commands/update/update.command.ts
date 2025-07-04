import { Command } from "@nestjs/cqrs";
import { ProfileEntity } from "../../entities/profile.entity";
import { UpdateProfileDto } from "../../dto";

export class UpdateProfileCommand extends Command<ProfileEntity>{
    constructor(
        public readonly userId: number,
        public readonly data: UpdateProfileDto
    ){
        super();
    }
}