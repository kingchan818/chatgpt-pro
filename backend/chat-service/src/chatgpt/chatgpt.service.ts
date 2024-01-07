import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isEmpty } from 'lodash';
import { Observable, map } from 'rxjs';
import { CustomLoggerService } from 'src/logger/logger.service';
export const importDynamic = new Function('modulePath', 'return import(modulePath)');

@Injectable({ scope: Scope.TRANSIENT })
export class ChatgptService {
  chatGPTAPI: any;
  constructor(
    private readonly configureService: ConfigService,
    private readonly logger: CustomLoggerService,
  ) {}

  async init(openAIAPIKey: string, chatgptOptions?: any) {
    const { ChatGPTAPI } = await importDynamic('chatgpt');
    const defaultConfig = this.configureService.get('chatgpt');
    isEmpty(chatgptOptions) && this.logger.log('No chatgpt options provided, using default config');
    !isEmpty(chatgptOptions) && this.logger.log('Using provided chatgpt options');

    this.chatGPTAPI = new ChatGPTAPI({
      apiKey: openAIAPIKey,
      ...defaultConfig,
      ...chatgptOptions,
    });
    return this.chatGPTAPI;
  }

  async startChatWithInit(requestId: string, currentUser: any, transaction: any) {
    await this.init(currentUser.openAITKey, transaction.chatOptions);
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
