import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { GenderEnum } from 'src/shared/enums/profile.enum';

export class CreateProfileDto {
  @Expose({ name: 'first_name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Expose({ name: 'last_name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Expose({ name: 'birthdate' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;

  @IsOptional()
  @IsString()
  avatar?: string;

  @Expose({ name: 'biography' })
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
