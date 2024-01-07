import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CustomLoggerService } from '../logger/logger.service';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { decrypt } from '../utils/crypto';
import { get } from 'lodash';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  constructor(
    private logger: CustomLoggerService,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    request.requestId = uuidv4(); // Generate a unique ID and add it to the request object
    request.now = new Date().toISOString(); // Add a timestamp to the request object
    request.userAgent = headers['user-agent']; // Add the user agent to the request object

    if (headers['x-auth-key']) {
      const userApiKey = headers['x-auth-key'].toString();
      const currentUser = await this.authService.validateAndReturnUser(request.requestId, userApiKey);
      const openAITKey = decrypt(get(currentUser, 'openAIToken'), this.configService.get<string>('aes-key'));
      request.currentUser = { openAITKey, userApiKey };
    }

    if (request.url.includes('sse')) {
      // TODO: if the request is a SSE request, we won't log it for now
      return next.handle();
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
