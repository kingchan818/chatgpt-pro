import { Body, Controller, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { sessionTransaction } from 'src/utils/common';
import { ApiKeyService } from 'src/api-key/api-key.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { encrypt } from 'src/utils';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private apiKeyService: ApiKeyService,
    private configService: ConfigService,
    @InjectConnection() private connection: Connection,
  ) {}

  // This action is if user provide OpenAI API key
  @Post('register')
  async registerOpenAPIKey(@Req() req, @Body() body: { openAIAPIKey: string }) {
    const { openAIAPIKey } = body;
    const isValidApiKey = await this.authService.validateOpenAIAPIKey(req.requestId, openAIAPIKey);
    if (isValidApiKey) {
      const encryptionKey = this.configService.get('encryption.key');
      const hashedApiKey = encrypt(openAIAPIKey, encryptionKey);
      const sessionTransactionCb = async (session) => {
        const { _id: apiKey } = await this.apiKeyService.create({ name: 'admin' }, session);
        await this.userService.create(req.requestId, { openAIToken: hashedApiKey, apiKeys: [apiKey] }, session);
        return apiKey;
      };
      const apiKey = await sessionTransaction(this.connection, sessionTransactionCb);

      return { apiKey: apiKey };
    }
    return {};
  }

  @Post('gen-new-key')
  async genNewApiKey(@Req() req, @Body() body: { openAIAPIKey: string; newKeyUsername: string }) {
    const { openAIAPIKey } = body;
    if (openAIAPIKey) {
      const encryptedApiKey = encrypt(openAIAPIKey, this.configService.get('encryption.key'));
      await this.userService.appendNewApiKey(req.requestId, { openAIToken: encryptedApiKey, username: body.newKeyUsername });
      const foundUser = await this.userService.findOne(req.requestId, { openAIToken: encryptedApiKey });
      if (foundUser) {
        return { apiKey: foundUser.apiKeys[foundUser.apiKeys.length - 1] };
      } else {
        throw new HttpException('UnKnown Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    throw new HttpException('No Api Key provided', HttpStatus.FORBIDDEN);
  }
}
