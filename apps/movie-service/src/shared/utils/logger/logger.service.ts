/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class AppLoggerService implements LoggerService {
  constructor(
    @InjectPinoLogger()
    private readonly pinoLogger: PinoLogger,
  ) {}

  setContext(context: string): void {
    this.pinoLogger.setContext(context);
  }
  log(message: any, data?: any): void {
    const payload =
      typeof message === 'object' ? JSON.stringify(message) : message;

    this.pinoLogger.info({ ...data }, payload);
  }
  error(message: any, trace?: string, data?: any): void {
    const payload =
      typeof message === 'object' ? JSON.stringify(message) : message;

    this.pinoLogger.error({ trace, ...data }, payload);
  }
  warn(message: any): void {
    const payload =
      typeof message === 'object' ? JSON.stringify(message) : message;

    this.pinoLogger.warn(payload);
  }
  debug(message: any, data?: any): void {
    const payload =
      typeof message === 'object' ? JSON.stringify(message) : message;

    this.pinoLogger.info({ data }, payload);
  }
  verbose?(message: any, ...optionalParams: any[]): void {
    throw new Error('Method not implemented.');
  }
  fatal?(message: any, data?: any): void {
    const payload =
      typeof message === 'object' ? JSON.stringify(message) : message;

    this.pinoLogger.fatal({ ...data }, payload);
  }
  setLogLevels?(levels: LogLevel[]): void {
    throw new Error('Method not implemented.');
  }
}
