import { Body, Controller, HttpException, Param, Post, Req, Sse, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { get } from 'lodash';

import { ChatgptService } from '../chatgpt/chatgpt.service';
import { TransactionService } from '../transaction/transaction.service';
import { generateUniqueKey } from '../utils';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';
import { HttpStatusCode } from 'axios';
import { ChatGuard } from './chat.guard';

@UseGuards(ChatGuard)
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatgptService: ChatgptService,
    private readonly transactionService: TransactionService,
    private readonly configService: ConfigService,
  ) {}

  @Post('create')
  async createChatSession(@Req() req: any, @Body() body: ChatDto) {
    const { requestId, currentUser } = req;
    const gptModelType = get(
      body,
      'chatOptions.model',
      this.configService.get('chatgpt.completionParams.model'),
    );
    const { usedTokens, usedUSD } = this.chatService.calculateToken(requestId, {
      userMessage: body.message,
      systemMessage: body.chatOptions?.systemMessage,
      model: gptModelType,
    });
    const result = await this.transactionService.create(requestId, {
      messageId: generateUniqueKey(),
      apiTokenRef: currentUser.userApiKey,
      message: body.message,
      chatOptions: body.chatOptions,
      tokenUsage: { usedTokens, usedUSD },
      llmType: gptModelType,
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

    if (!foundTransaction) {
      throw new HttpException('Message not found', HttpStatusCode.NotFound);
    }

    let subscriptions;

    if (!foundTransaction.parentMessageId) {
      subscriptions = await this.chatgptService.startChatWithInit(requestId, currentUser, foundTransaction);
    } else {
      subscriptions = this.chatgptService.startChat({
        requestId,
        message: foundTransaction.message,
        parentMessageId: foundTransaction.parentMessageId,
      });
    }

    // this function will calculate the token usage and save it to db when the subscription is completed
    this.chatService.handleChatSubscription({ subscriptions, req, requestId, messageId });
    return subscriptions;
  }

  @Post('continue')
  async continueChatSession(@Req() req: any, @Body() body: ChatDto) {
    const { requestId, currentUser } = req;

    const gptModelType = get(
      body,
      'chatOptions.model',
      this.configService.get('chatgpt.completionParams.model'),
    );

    const { usedTokens, usedUSD } = this.chatService.calculateToken(requestId, {
      userMessage: body.message,
      systemMessage: body.chatOptions?.systemMessage,
      model: gptModelType,
    });

    const result = await this.transactionService.create(requestId, {
      messageId: generateUniqueKey(),
      apiTokenRef: currentUser.userApiKey,
      message: body.message,
      parentMessageId: body.parentMessageId,
      tokenUsage: { usedTokens, usedUSD },
      llmType: gptModelType,
    });
    return result;
  }
}
