import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CustomLoggerService } from '../logger/logger.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  constructor(
    private logger: CustomLoggerService,
    private authService: AuthService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    request.requestId = uuidv4(); // Generate a unique ID and add it to the request object
    request.now = new Date().toISOString(); // Add a timestamp to the request object
    request.userAgent = headers['user-agent']; // Add the user agent to the request object

    if (headers['x-auth-key']) {
      const token = headers['x-auth-key'].toString();
      const validUser = this.authService.validateUser(request.requestId, token);
      if (!validUser) {
        throw new HttpException('Invalid API key', HttpStatus.FORBIDDEN);
      }
      request.apiKey = token;
    }

    this.logger.log(
      `[${className}.${handlerName}] START [${request.requestId}] - ${request.method} ${
        request.url
      } params: ${JSON.stringify(request.params)} body: ${JSON.stringify(request.body)}`,
      RequestInterceptor.name,
    );

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `[${className}.${handlerName}] END [${request.requestId}]  - ${request.method} ${
              request.url
            } params: ${JSON.stringify(request.params)} body: ${JSON.stringify(request.body)}`,
            RequestInterceptor.name,
          ),
        ),
      );
  }
}
