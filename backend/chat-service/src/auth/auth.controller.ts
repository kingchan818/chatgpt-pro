import { Body, Controller, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  // This action is if user provide OpenAI API key
  @Post('register')
  async registerOpenAPIKey(@Req() req, @Body() body: { openAIAPIKey: string }) {
    const { openAIAPIKey } = body;
    const isValidApiKey = await this.authService.validateOpenAIAPIKey(req.requestId, openAIAPIKey);
    if (isValidApiKey) {
      // TODO: find a way to encrypt the openAIAPIKey before saving to DB and I want it to be decryptable and unique
      // const hashedToken = encrypt(openAIAPIKey, this.configService.get('aes-key'));
      const user = await this.userService.create(req.requestId, {
        openAIToken: openAIAPIKey,
      });
      const apiKey = user.apiKeys[0];
      return { apiKey: apiKey };
    }
    return {};
  }

  @Post('gen-new-key')
  async genNewApiKey(@Req() req) {
    const { apiKey } = req;
    if (apiKey) {
      await this.userService.appendNewApiKey(req.requestId);
      const foundUser = await this.userService.findOne(req.requestId, apiKey);
      if (foundUser) {
        return { apiKey: foundUser.apiKeys[foundUser.apiKeys.length - 1] };
      } else {
        throw new HttpException('UnKnown Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    throw new HttpException('UnKnown Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
