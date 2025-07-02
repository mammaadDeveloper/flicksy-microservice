import { ClassConstructor } from 'class-transformer';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FormatterInterface {
  format<T, V>(cls: ClassConstructor<T>, data: V): T | T[];
  formatError(error: Error): any;
}
