import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChatgptService } from '../chatgpt/chatgpt.service';
import { CustomLoggerService } from '../logger/logger.service';
import { UserService } from '../user/user.service';
import { isNil } from 'lodash';
@Injectable()
export class AuthService {
  constructor(
    private logger: CustomLoggerService,
    private chatgptService: ChatgptService,
    private userService: UserService,
  ) {}

  async validateAndReturnUser(requestId: string, apiKey: string) {
    this.logger.log(`[${requestId}] -- Validate user`);
    const foundUser = await this.userService.findOne(requestId, { apiKeys: apiKey });
    if (isNil(foundUser)) {
      throw new HttpException('Invalid API key', HttpStatus.FORBIDDEN);
    }
    return foundUser;
  }

  async validateOpenAIAPIKey(requestId: string, openAIAPIKey: string): Promise<boolean> {
    this.logger.log(`[${requestId}] -- Validate openAIAPIKey`);
    await this.chatgptService.loadAvailableModels(requestId, openAIAPIKey);
    return true;
  }
}
