import { Body, Controller, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { encrypt } from '../utils';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  // This action is if user provide OpenAI API key
  @Post('register')
  async registerOpenAPIKey(@Req() req, @Body() body: { openAIAPIKey: string }) {
    const { openAIAPIKey } = body;
    const isValidApiKey = await this.authService.validateOpenAIAPIKey(req.requestId, openAIAPIKey);
    if (isValidApiKey) {
      const hasedToken = encrypt(openAIAPIKey, this.configService.get('aes-key'));
      const user = await this.userService.create(req.requestId, {
        openAIToken: hasedToken,
      });
      const apiKey = user.apiKeys[0];
      return { apiKey: apiKey };
    }

    throw new HttpException('Unknow Error', HttpStatus.BAD_REQUEST);
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
        throw new HttpException('Unknow Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    throw new HttpException('Unknow Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
