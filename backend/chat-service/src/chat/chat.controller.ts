import { Body, Controller, HttpException, Param, Post, Req, Sse, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { get, isEmpty } from 'lodash';

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

    // create system message and user message
    const collectionId = generateUniqueKey();
    const result = await this.transactionService.create(requestId, [
      {
        messageId: generateUniqueKey(),
        collectionId,
        role: 'system',
        apiTokenRef: currentUser.userApiKey,
        message: body.chatOptions?.systemMessage || this.configService.get('chatgpt.systemMessage'),
        chatOptions: body.chatOptions,
        tokenUsage: { usedTokens, usedUSD },
        llmType: gptModelType,
      },
      {
        messageId: generateUniqueKey(),
        collectionId,
        role: 'user',
        apiTokenRef: currentUser.userApiKey,
        message: body.message,
        chatOptions: body.chatOptions,
        tokenUsage: { usedTokens, usedUSD },
        llmType: gptModelType,
      },
    ]);

    return result;
  }

  @Sse('sse/:collectionId')
  async sse(@Req() req: any, @Param('collectionId') collectionId: string) {
    const { requestId, currentUser } = req;
    // find msg in db
    const foundTransactions = await this.transactionService.find(
      requestId,
      { collectionId, apiTokenRef: currentUser.userApiKey },
      { createdDT: 1 },
    );

    if (isEmpty(foundTransactions)) {
      throw new HttpException('Message not found', HttpStatusCode.NotFound);
    }

    const chatCompletion$ = this.chatgptService.createChatCompletion({
      requestId,
      openAIKey: currentUser.openAIKey,
      messages: foundTransactions.map((transaction) => ({
        role: transaction.role,
        content: transaction.message,
      })),
      collectionId,
      model: get(foundTransactions, '0.llmType'),
    });

    this.chatService.handleSEESubscription(req, chatCompletion$);

    return chatCompletion$;
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
      collectionId: body.collectionId,
      apiTokenRef: currentUser.userApiKey,
      role: 'user',
      message: body.message,
      tokenUsage: { usedTokens, usedUSD },
      llmType: gptModelType,
    });
    return result;
  }
}
