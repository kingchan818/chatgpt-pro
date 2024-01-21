import { HttpException, HttpStatus, Injectable, OnModuleInit, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { get, isEmpty } from 'lodash';
import { Observable, map } from 'rxjs';
import { CustomLoggerService } from 'src/logger/logger.service';
import axios from 'axios';
export const importDynamic = new Function('modulePath', 'return import(modulePath)');

@Injectable({ scope: Scope.TRANSIENT })
export class ChatgptService implements OnModuleInit {
  chatGPTAPI: any;
  importChatGptInstance: any;
  constructor(
    private readonly configureService: ConfigService,
    private readonly logger: CustomLoggerService,
  ) {}

  async onModuleInit() {
    const { ChatGPTAPI } = await importDynamic('chatgpt');
    this.importChatGptInstance = ChatGPTAPI;
  }

  async validateOpenAIAPIKey(requestId: string, openAIAPIKey: string): Promise<boolean> {
    this.logger.log(`[${requestId}] -- Validate openAIAPIKey`);
    try {
      await axios({
        method: 'get',
        url: 'https://api.openai.com/v1/models',
        headers: {
          Authorization: `Bearer ${openAIAPIKey}`,
        },
      });
      return true;
    } catch (ex) {
      this.logger.error(`[${requestId}] -- Invalid API key`);

      throw new HttpException(
        get(ex, 'response.data.error.message', 'Invalid API key'),
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async init(openAIAPIKey: string, chatgptOptions?: any) {
    const defaultConfig = this.configureService.get('chatgpt');
    isEmpty(chatgptOptions) && this.logger.log('No chatgpt options provided, using default config');
    !isEmpty(chatgptOptions) && this.logger.log('Using provided chatgpt options');
    this.chatGPTAPI = new this.importChatGptInstance({
      apiKey: openAIAPIKey,
      ...defaultConfig,
      ...chatgptOptions,
      debug: true,
    });
    return this.chatGPTAPI;
  }

  async startChatWithInit(requestId: string, currentUser: any, transaction: any) {
    await this.init(currentUser.openAIKey, transaction.chatOptions);
    return this.startChat({
      requestId,
      message: transaction.message,
      parentMessageId: transaction?.parentMessageId,
    });
  }

  startChat(params: { requestId: string; message: string; parentMessageId?: string }) {
    const { message, parentMessageId } = params;
    isEmpty(parentMessageId) &&
      this.logger.log(`[${params.requestId}] -- No parentMessageId provided, starting new chat`);

    !isEmpty(parentMessageId) &&
      this.logger.log(
        `[${params.requestId}] -- parentMessageId provided, continuing chat ${parentMessageId}`,
      );

    const observer = new Observable((subscriber) => {
      this.chatGPTAPI.sendMessage(message, {
        parentMessageId,
        onProgress: (partialResponse) => {
          subscriber.next(partialResponse);
          if (partialResponse.detail.choices[0].finish_reason === 'stop') {
            subscriber.complete();
          }
        },
      });
    });

    return observer.pipe(map((response) => ({ data: response })));
  }
}
