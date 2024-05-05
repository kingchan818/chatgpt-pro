import { HttpException, Injectable } from '@nestjs/common';
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
    @InjectConnection() private readonly connection: Connection,
  ) {}

  calculateToken(
    requestId: string,
    params: {
      model?: supportModelType;
      systemMessage?: string;
      userMessage?: string;
      assistantMessage?: string;
    },
  ) {
    this.logger.log(`[${requestId}] -- Calculate chatgpt token`);

    const { model, systemMessage, userMessage, assistantMessage } = params;

    const messages: any = [
      { role: 'system', content: systemMessage },
      { role: 'user', content: userMessage },
      { role: 'assistant', content: assistantMessage },
    ].filter((message) => !isEmpty(message.content));

    const usage = new GPTTokens({ model, messages });
    return usage;
  }

  handleSEESubscription(req: any, chatCompletion$: Observable<any>) {
    const { requestId, currentUser } = req;

    let chatCompletionObject: CreateTransactionDto;
    let chatCompletionObjectString: string;

    const subscription = chatCompletion$.subscribe({
      next: (objStr: string) => {
        chatCompletionObjectString = objStr;
      },
      error: (err) => {
        console.error('Error:', err);
      },
      complete: async () => {
        chatCompletionObject = JSON.parse(chatCompletionObjectString);

        if (!chatCompletionObject) {
          throw new HttpException('There is no subscriptions from openAI', HttpStatusCode.NotFound);
        }

        const { usedTokens, usedUSD } = this.calculateToken(requestId, {
          model: chatCompletionObject?.llmType as any,
          assistantMessage: chatCompletionObject.message,
        });

        await sessionTransaction(this.connection, async (session: any) => {
          await this.transactionService.create(requestId, {
            ...chatCompletionObject,
            apiTokenRef: currentUser.userApiKey,
            tokenUsage: { usedTokens, usedUSD },
          });

          await this.apiKeyService.updateUsageCount(currentUser.userApiKey, { usageCount: usedUSD }, session);
        });
      },
    });

    req.on('close', () => {
      if (chatCompletion$) {
        subscription.unsubscribe();
      }
    });
  }
}
