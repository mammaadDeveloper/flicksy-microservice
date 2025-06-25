import { PartialType } from '@nestjs/mapped-types';
import { AddMovieCommand, CreateMovieDto } from './create.dto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {}

export class ChangeMovieCommand extends PartialType(AddMovieCommand) {}
