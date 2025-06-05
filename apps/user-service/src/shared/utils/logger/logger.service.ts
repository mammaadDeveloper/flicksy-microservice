import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class AppLoggerService implements LoggerService {
  constructor(
    @InjectPinoLogger()
    private readonly pinoLogger: PinoLogger,
  ) {}

  setContext(context: string) {
    this.pinoLogger.setContext(context);
  }
  log(message: any, data?: any) {
    const payload =
      typeof message === 'object' ? JSON.stringify(message) : message;

    this.pinoLogger.info({ ...data }, payload);
  }
  error(message: any, trace?: string, data?: any) {
    const payload =
      typeof message === 'object' ? JSON.stringify(message) : message;

    this.pinoLogger.error({ trace, ...data }, payload);
  }
  warn(message: any) {
    const payload =
      typeof message === 'object' ? JSON.stringify(message) : message;

    this.pinoLogger.warn(payload);
  }
  debug(message: any, data?: any) {
    const payload =
      typeof message === 'object' ? JSON.stringify(message) : message;

    this.pinoLogger.info({ data }, payload);
  }
  verbose?(message: any, ...optionalParams: any[]) {
    throw new Error('Method not implemented.');
  }
  fatal?(message: any, data?: any) {
    const payload =
      typeof message === 'object' ? JSON.stringify(message) : message;

    this.pinoLogger.fatal({ ...data }, payload);
  }
  setLogLevels?(levels: LogLevel[]) {
    throw new Error('Method not implemented.');
  }
}
