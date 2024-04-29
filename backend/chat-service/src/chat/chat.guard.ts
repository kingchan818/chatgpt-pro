import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { isEmpty, isNil } from 'lodash';
import { ApiKeyService } from 'src/api-key/api-key.service';

@Injectable()
export class ChatGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private apiKeyService: ApiKeyService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    if (headers['x-auth-key']) {
      const isValidKey = await this.checkApiKeyIsValid(headers);
      const isNotReachingLimit = await this.checkIsReachingTokenLimit(headers);
      if (isValidKey && isNotReachingLimit) {
        return true;
      } else {
        throw new HttpException('Invalid API key or token limit reached contact the project admin', HttpStatus.FORBIDDEN);
      }
    }
    throw new HttpException('No API key provided', HttpStatus.UNAUTHORIZED);
  }

  async checkApiKeyIsValid(headers: any) {
    const userApiKey = headers['x-auth-key'].toString();
    const currentUser = await this.authService.validateAndReturnUser('CHAT-GUARD', userApiKey);
    if (!isNil(currentUser) || !isEmpty(currentUser)) {
      return true;
    }
  }

  async checkIsReachingTokenLimit(headers: any) {
    const userApiKey = headers['x-auth-key'].toString();
    const apiKeyContent = await this.apiKeyService.findOne(userApiKey);

    if (!isNil(apiKeyContent) && !isEmpty(apiKeyContent)) {
      const { usageCount, usageLimit } = apiKeyContent;
      if (usageCount < usageLimit) {
        return true;
      }
    }

    return false;
  }
}
