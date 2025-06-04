import {
  IsBoolean,
  IsIP,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsIP()
  ip: string;

  @IsNotEmpty()
  @IsString()
  user_agent: string;

  @IsNotEmpty()
  @IsUUID()
  jti: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsBoolean()
  isRevoked?: boolean = false;
}
