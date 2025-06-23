import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateTrailerDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsOptional()
  @IsString()
  file?: string;
}
