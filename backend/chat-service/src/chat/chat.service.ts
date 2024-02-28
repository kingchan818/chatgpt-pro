import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GPTTokens, supportModelType } from 'gpt-tokens';
import { isEmpty, set } from 'lodash';
import { Observable, Subscribable } from 'rxjs';
import { CustomLoggerService } from 'src/logger/logger.service';
import { TransactionService } from 'src/transaction/transaction.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly logger: CustomLoggerService,
    private readonly configService: ConfigService,
    private readonly transactionService: TransactionService,
  ) {}

  calculateToken(
    requestId: string,
    params: { model?: supportModelType; systemMessage?: string; userMessage?: string },
  ) {
    this.logger.log(`[${requestId}] -- Calculate chatgpt token`);

    if (isEmpty(params.systemMessage)) {
      const defaultChatGPTSystemMessage = this.configService.get<string>('chatgpt.systemMessage');
      set(params, 'systemMessage', defaultChatGPTSystemMessage);
    }

    if (isEmpty(params.model)) {
      const defaultChatGPTModel = this.configService.get<string>('chatgpt.completionParams.model');
      set(params, 'model', defaultChatGPTModel);
    }

    const { model, systemMessage, userMessage } = params;
    const messages = [];

    if (!isEmpty(systemMessage)) {
      messages.push({
        role: 'system',
        content: systemMessage,
      });
    }

    if (!isEmpty(userMessage)) {
      messages.push({
        role: 'user',
        content: userMessage,
      });
    }
    console.log('model', model);

    const usage = new GPTTokens({ model, messages });
    return usage;
  }

  handleChatSubscription(params: {
    subscriptions: Observable<any> | Subscribable<any>;
    req: any;
    requestId: string;
    messageId: string;
  }) {
    const { subscriptions, req, requestId, messageId } = params;
    let tmpResult = null;

    subscriptions.subscribe({
      next: (data) => {
        tmpResult = data.data;
      },
      complete: async () => {
        const { usedTokens, usedUSD } = this.calculateToken(requestId, {
          systemMessage: tmpResult.text,
          model: tmpResult.detail.model,
        });
        await this.transactionService.updateTokenUsage(requestId, messageId, { usedTokens, usedUSD });
        req.res.end(); // Manually end the response on completion
      },
      error: (err) => {
        throw err;
      },
    });
  }
}
