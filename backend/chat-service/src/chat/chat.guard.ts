import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { isEmpty, isNil } from 'lodash';

@Injectable()
export class ChatGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    if (headers['x-auth-key']) {
      const userApiKey = headers['x-auth-key'].toString();
      const currentUser = await this.authService.validateAndReturnUser('CHAT-GUARD', userApiKey);
      if (!isNil(currentUser) || !isEmpty(currentUser)) {
        return true;
      }
    }
    return false;
  }
}
