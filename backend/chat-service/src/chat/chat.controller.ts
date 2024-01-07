import { supportModelType } from 'gpt-tokens';

import { Body, Controller, Param, Post, Req, Sse } from '@nestjs/common';

import { ChatgptService } from '../chatgpt/chatgpt.service';
import { TransactionService } from '../transaction/transaction.service';
import { generateUniqueKey } from '../utils';
import { ChatService } from './chat.service';

export interface ChatDetails {
  parentMessageId?: string;
  message: string;
  chatOptions?: {
    model?: supportModelType;
    temperature?: number;
    systemMessage?: string;
  };
}

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatgptService: ChatgptService,
    private readonly transactionService: TransactionService,
  ) {}

  @Post('create')
  async createChatSession(@Req() req: any, @Body() body: ChatDetails) {
    const { requestId, currentUser } = req;
    const { usedTokens, usedUSD } = this.chatService.calculateToken(requestId, {
      userMessage: body.message,
      systemMessage: body.chatOptions?.systemMessage,
      model: body.chatOptions?.model,
    });
    const result = await this.transactionService.create(requestId, {
      messageId: generateUniqueKey(),
      apiTokenRef: currentUser.userApiKey,
      message: body.message,
      chatOptions: body.chatOptions,
      tokenUsage: { usedTokens, usedUSD },
    });
    return result;
  }

  @Sse('sse/:messageId')
  async sse(@Req() req: any, @Param('messageId') messageId: string) {
    const { requestId, currentUser } = req;
    // find msg in db
    const foundTransaction = await this.transactionService.findOne(requestId, {
      messageId,
      apiTokenRef: currentUser.userApiKey,
    });

    const subscriptions = await this.chatgptService.startChatWithInit(
      requestId,
      currentUser,
      foundTransaction,
    );

    // this function will calculate the token usage and save it to db when the subscription is completed
    this.chatService.handleChatSubscription({ subscriptions, req, requestId, messageId });
    return subscriptions;
  }

  @Post('continue')
  async continueChatSession(@Req() req: any, @Body() body: ChatDetails) {
    const { requestId, currentUser } = req;

    const { usedTokens, usedUSD } = this.chatService.calculateToken(requestId, {
      userMessage: body.message,
      systemMessage: body.chatOptions?.systemMessage,
      model: body.chatOptions?.model,
    });

    const result = await this.transactionService.create(requestId, {
      messageId: generateUniqueKey(),
      apiTokenRef: currentUser.userApiKey,
      message: body.message,
      parentMessageId: body.parentMessageId,
      tokenUsage: { usedTokens, usedUSD },
    });
    return result;
  }
}
