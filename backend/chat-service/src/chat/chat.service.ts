import { HttpException, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectConnection } from '@nestjs/mongoose';
import { HttpStatusCode } from 'axios';
import { GPTTokens, supportModelType } from 'gpt-tokens';
import { isEmpty } from 'lodash';
import { Connection } from 'mongoose';
import { Observable } from 'rxjs';
import { ApiKeyService } from 'src/api-key/api-key.service';
import { CustomLoggerService } from 'src/logger/logger.service';
import { CreateTransactionDto } from 'src/transaction/dto/create-transaction.dto';
import { TransactionService } from 'src/transaction/transaction.service';
import { sessionTransaction } from 'src/utils/common';

@Injectable()
export class ChatService {
  constructor(
    private readonly logger: CustomLoggerService,
    private readonly transactionService: TransactionService,
    private readonly apiKeyService: ApiKeyService,
    private readonly eventEmitter: EventEmitter2,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  calculateToken(
    requestId: string,
    params: {
      model?: supportModelType;
      systemMessage?: string;
      userMessage?: string;
      assistantMessage?: string;
      collectionMessages?: any[];
    },
  ) {
    this.logger.log(`[${requestId}] -- Calculate chatgpt token`);

    const { model, systemMessage, userMessage, assistantMessage, collectionMessages } = params;
    let messages: any = [];

    if (!isEmpty(collectionMessages)) {
      messages = collectionMessages.map((message) => ({
        role: message.role,
        content: message.message,
      }));
    } else {
      messages = [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
        { role: 'assistant', content: assistantMessage },
      ].filter((message) => !isEmpty(message.content));
    }

    const usage = new GPTTokens({ model, messages, debug: true });
    return usage;
  }

  handleSEESubscription(req: any, chatCompletion$: Observable<any>) {
    const { requestId, currentUser } = req;

    let chatCompletionObject: CreateTransactionDto;
    let chatCompletionObjectString: string;
    this.logger.log(`[${requestId}] -- Handle SSE subscription`);

    chatCompletion$.subscribe({
      next: (objStr: string) => {
        chatCompletionObjectString = objStr;
      },
      error: (err) => {
        this.logger.error('Error:', err);
      },
      complete: async () => {
        this.logger.log(`[${requestId}] -- SSE subscription completed`);
        chatCompletionObject = JSON.parse(chatCompletionObjectString);

        if (!chatCompletionObject) {
          throw new HttpException('There is no subscriptions from openAI', HttpStatusCode.NotFound);
        }

        this.eventEmitter.emit('chatgpt.sse.finished', {
          requestId,
          currentUser,
          chatCompletionObject,
        });
      },
    });
  }

  @OnEvent('chatgpt.sse.finished')
  async handleSSESubscriptionOnFinished(params: { requestId: string; currentUser: any; chatCompletionObject: any }) {
    const { requestId, currentUser, chatCompletionObject } = params;
    this.logger.log(`[${requestId}] >>>>>>>>>>>>> Update SSE transaction [START]`);

    await sessionTransaction(this.connection, async (session: any) => {
      const messages = await this.transactionService.find(
        requestId,
        {
          collectionId: chatCompletionObject.collectionId,
          apiTokenRef: currentUser.userApiKey,
        },
        { createdDT: 1 },
        session,
      );

      messages.push(chatCompletionObject);
      const { usedTokens, usedUSD } = this.calculateToken(requestId, {
        model: chatCompletionObject?.llmType as any,
        collectionMessages: messages,
      });

      await this.transactionService.create(
        requestId,
        {
          ...chatCompletionObject,
          apiTokenRef: currentUser.userApiKey,
          tokenUsage: { usedTokens, usedUSD },
        },
        session,
      );

      await this.apiKeyService.updateUsageCount(currentUser.userApiKey, { usageCount: usedUSD }, session);
    });
    this.logger.log(`[${requestId}] >>>>>>>>>>>>> Update SSE transaction [ END ]`);
  }
}
