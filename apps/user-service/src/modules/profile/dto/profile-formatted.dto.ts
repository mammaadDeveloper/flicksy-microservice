import { Exclude, Expose, instanceToPlain } from "class-transformer";
import { GenderEnum } from "src/shared/enums/profile.enum";
import { ProfileEntity } from "../entities/profile.entity";
import { BaseDto } from "src/common";

@Exclude()
export class ProfileCreateFormattedDto extends BaseDto {
    @Expose({name: 'firstName'})
    first_name: string;

    @Expose({name: 'lastName'})
    last_name: string;

    @Expose({name: 'birthDate'})
    birth_date: string;

    @Expose()
    gender: GenderEnum;
    
    @Expose()
    avatar: string;

    @Expose({name: 'bio'})
    biography: string;

    @Expose()
    address: string;

    constructor(profile: Partial<ProfileEntity>){
        super();
        Object.assign(this, profile);
    }
}