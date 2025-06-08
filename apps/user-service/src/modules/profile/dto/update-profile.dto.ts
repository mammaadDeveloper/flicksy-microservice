import { OmitType } from "@nestjs/mapped-types";
import { CreateProfileDto } from "./create-profile.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateProfileDto extends OmitType(CreateProfileDto, ['avatar'] as const){}

export class UpdateAvatarDto{
    @IsNotEmpty()
    @IsString()
    avatar: string;
}