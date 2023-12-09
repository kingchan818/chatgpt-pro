import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomLoggerService extends ConsoleLogger {
  private serviceName: string;

  constructor(configService: ConfigService) {
    super();
    this.serviceName = configService.get<string>('name');
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    super.log(`[${this.serviceName}] ${message}`, ...optionalParams);
  }

  /**
   * Write a 'fatal' level log.
   */
  fatal(message: any, ...optionalParams: any[]) {
    super.fatal(`[${this.serviceName}] ${message}`, ...optionalParams);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    super.error(`[${this.serviceName}] ${message}`, ...optionalParams);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    super.warn(`[${this.serviceName}] ${message}`, ...optionalParams);
  }

  /**
   * Write a 'debug' level log.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  debug(message: any, ...optionalParams: any[]) {
    super.debug(`[${this.serviceName}] ${message}`, ...optionalParams);
  }

  /**
   * Write a 'verbose' level log.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  verbose(message: any, ...optionalParams: any[]) {
    super.verbose(`[${this.serviceName}] ${message}`, ...optionalParams);
  }
}
