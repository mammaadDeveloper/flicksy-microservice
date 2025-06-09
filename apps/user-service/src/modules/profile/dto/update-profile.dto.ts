import { OmitType } from "@nestjs/mapped-types";
import { CreateProfileDto } from "./create-profile.dto";

export class UpdateProfileDto extends OmitType(CreateProfileDto, ['avatar'] as const){}