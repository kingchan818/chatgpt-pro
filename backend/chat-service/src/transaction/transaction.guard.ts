import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { isEmpty, isNil } from 'lodash';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class TransactionGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    if (headers['x-auth-key']) {
      const userApiKey = headers['x-auth-key'].toString();
      const currentUser = await this.authService.validateAndReturnUser('TRANSACTION-GUARD', userApiKey);
      if (!isNil(currentUser) || !isEmpty(currentUser)) {
        return true;
      }
    }
    return false;
  }
}
