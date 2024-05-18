import { HttpException, HttpStatus, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { get, isEmpty } from 'lodash';
import { Observable } from 'rxjs';
import { CustomLoggerService } from 'src/logger/logger.service';
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

  async loadAvailableModels(requestId: string, openAIAPIKey: string): Promise<any> {
    this.logger.log(`[${requestId}] -- Load available models`);
    try {
      const openAI = new OpenAI({ apiKey: openAIAPIKey });
      const models = await openAI.models.list();

      return models;
    } catch (error) {
      this.logger.error(`[${requestId}] -- Error loading models`);

      throw new HttpException(
        get(error, 'response.data.error.message', 'Invalid API key or error loading models'),
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
    temperature?: number;
    [key: string]: any;
  }) {
    const { requestId, openAIKey, messages, model, collectionId, temperature } = params;

    this.logger.log(`[${requestId}] -- Create chat completion`);

    const completionObservable = new Observable((subscriber) => {
      (async () => {
        try {
          const openAI = new OpenAI({ apiKey: openAIKey });
          const completion = await openAI.chat.completions.create({
            messages,
            temperature,
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
              // when user unsubscribes
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
