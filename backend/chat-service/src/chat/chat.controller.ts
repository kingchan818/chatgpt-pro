import { Body, Controller, Get, HttpException, Param, Post, Req, Sse, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { filter, get, isEmpty } from 'lodash';

import { ChatgptService } from '../chatgpt/chatgpt.service';
import { TransactionService } from '../transaction/transaction.service';
import { generateUniqueKey } from '../utils';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';
import { HttpStatusCode } from 'axios';
import { ChatGuard } from './chat.guard';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ApiKeyService } from 'src/api-key/api-key.service';

@UseGuards(ChatGuard)
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatgptService: ChatgptService,
    private readonly transactionService: TransactionService,
    private readonly configService: ConfigService,
    private readonly apiKeyService: ApiKeyService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Post('create')
  async createChatSession(@Req() req: any, @Body() body: ChatDto) {
    const { requestId, currentUser } = req;
    const gptModelType = get(body, 'chatOptions.model', this.configService.get('chatgpt.completionParams.model'));

    const collectionId = generateUniqueKey();
    const sessionResult = await this.transactionService.create(requestId, [
      {
        messageId: generateUniqueKey(),
        collectionId,
        role: 'system',
        apiTokenRef: currentUser.userApiKey,
        message: !isEmpty(body.chatOptions?.systemMessage)
          ? body.chatOptions.systemMessage
          : this.configService.get('chatgpt.systemMessage'),
        chatOptions: body.chatOptions,
        tokenUsage: {},
        llmType: gptModelType,
      },
      {
        messageId: generateUniqueKey(),
        collectionId,
        role: 'user',
        apiTokenRef: currentUser.userApiKey,
        message: body.message,
        chatOptions: body.chatOptions,
        tokenUsage: {},
        llmType: gptModelType,
      },
    ]);
    return sessionResult;
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

    const latestChatTransaction = foundTransactions[foundTransactions.length - 1];

    const chatCompletion$ = this.chatgptService.createChatCompletion({
      requestId,
      openAIKey: currentUser.openAIKey,
      temperature: (latestChatTransaction.chatOptions as any)?.temperature,
      messages: foundTransactions.map((transaction) => ({
        role: transaction.role,
        content: transaction.message,
      })),
      collectionId,
      model: latestChatTransaction.llmType,
    });

    this.chatService.handleSEESubscription(req, chatCompletion$);

    return chatCompletion$;
  }

  @Post('continue')
  async continueChatSession(@Req() req: any, @Body() body: ChatDto) {
    const { requestId, currentUser } = req;
    const gptModelType = get(body, 'chatOptions.model', this.configService.get('chatgpt.completionParams.model'));

    const transactionResult = await this.transactionService.create(requestId, {
      messageId: generateUniqueKey(),
      collectionId: body.collectionId,
      apiTokenRef: currentUser.userApiKey,
      role: 'user',
      message: body.message,
      tokenUsage: {},
      llmType: gptModelType,
      chatOptions: body.chatOptions,
    });

    return transactionResult;
  }

  @Get('model')
  async loadAllAvailableModels(@Req() req: any) {
    const { requestId, currentUser } = req;
    const { data } = await this.chatgptService.loadAvailableModels(requestId, currentUser.openAIKey);
    return filter(data, (model) => model.id.includes('gpt'));
  }
}
