import { HttpException, Injectable } from '@nestjs/common';
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

  async validateUser(requestId: string, apiKey: string): Promise<boolean> {
    this.logger.log(`[${requestId}] -- Validate user`);
    const foundUser = await this.userService.findOne(requestId, apiKey);
    if (!isNil(foundUser)) {
      return true;
    }
    return false;
  }

  async validateOpenAIAPIKey(requestId: string, openAIAPIKey: string): Promise<boolean> {
    try {
      this.logger.log(`[${requestId}] -- Validate openAIAPIKey`);
      const chatgptInstance = await this.chatgptService.init(openAIAPIKey);
      if (!chatgptInstance) {
        return false;
      }
      return true;
    } catch (e) {
      throw new HttpException(e.message || 'Invalid API key', 500);
    }
  }
}
