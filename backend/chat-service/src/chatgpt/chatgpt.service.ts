import { HttpException, HttpStatus, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { get, isEmpty } from 'lodash';
import { Observable } from 'rxjs';
import { CustomLoggerService } from 'src/logger/logger.service';
import axios from 'axios';
import OpenAI from 'openai';
import { generateUniqueKey } from 'src/utils';
import { CreateTransactionDto } from 'src/transaction/dto/create-transaction.dto';

@Injectable({ scope: Scope.DEFAULT })
export class ChatgptService {
  chatGPTAPI: any;
  importChatGptInstance: any;
  constructor(
    private readonly configureService: ConfigService,
    private readonly logger: CustomLoggerService,
  ) {}

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

  createChatCompletion(params: {
    requestId: string;
    openAIKey: string;
    messages: any[];
    model?: string;
    collectionId: string;
    [key: string]: any;
  }) {
    const { requestId, openAIKey, messages, model, collectionId } = params;

    this.logger.log(`[${requestId}] -- Create chat completion`);

    const completionObservable = new Observable((subscriber) => {
      (async () => {
        try {
          const openAI = new OpenAI({ apiKey: openAIKey });
          const completion = await openAI.chat.completions.create({
            messages,
            model: model || this.configureService.get('chatgpt.completionParams.model'),
            stream: true,
          });

          const transactionObj: CreateTransactionDto = {
            collectionId,
            role: 'assistant',
            chatOptions: {},
            message: '',
            apiTokenRef: '',
            messageId: generateUniqueKey(),
            llmType: model,
            tokenUsage: {},
          };

          let msg = '';

          for await (const chunk of completion) {
            if (subscriber.closed) {
              break;
            }

            const chatgptContent = chunk.choices[0].delta.content;
            msg += isEmpty(chatgptContent) ? '' : chatgptContent;

            subscriber.next(
              JSON.stringify({
                ...transactionObj,
                message: msg,
              }),
            );
          }
          subscriber.complete();
        } catch (error) {
          subscriber.error(error);
        }
      })();
    });

    return completionObservable;
  }
}
