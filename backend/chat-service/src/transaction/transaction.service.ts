import { Model } from 'mongoose';

import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { get, isEmpty, set } from 'lodash';
import { CustomLoggerService } from '../logger/logger.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './schema/transaction.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
    private readonly logger: CustomLoggerService,
  ) {}

  create(requestId: string, createTransactionDto: CreateTransactionDto[] | CreateTransactionDto, session?: any) {
    this.logger.log(`[${requestId}] -- Create new chat transaction`);
    this.logger.verbose(`[${requestId}] -- Create new chat transaction ${JSON.stringify(createTransactionDto)}`);
    const createTransactionDtos = Array.isArray(createTransactionDto) ? createTransactionDto : [createTransactionDto];
    return this.transactionModel.create(createTransactionDtos, { session });
  }

  findOne(requestId: string, documentFields: Record<string, any>) {
    this.logger.log(`[${requestId}] -- Find one chat transaction by document fields`);
    this.logger.verbose(`[${requestId}] -- Find one chat transaction by document fields ${JSON.stringify(documentFields)}`);
    return this.transactionModel.findOne(documentFields).exec();
  }

  update(messageId: string, updateTransactionDto: UpdateTransactionDto) {
    this.logger.log(`[${messageId}] -- Update chat transaction`);
    this.logger.verbose(`[${messageId}] -- Update chat transaction ${JSON.stringify(updateTransactionDto)}`);
    return this.transactionModel.updateOne({ messageId }, updateTransactionDto).exec();
  }

  async updateTokenUsage(requestId: string, messageId: string, tokenUsage: Record<string, any>) {
    this.logger.log(`[${requestId}] -- Update chat transaction token usage`);
    this.logger.verbose(`[${requestId}] -- Update chat transaction token usage ${JSON.stringify(tokenUsage)}`);
    const foundResult = await this.findOne(requestId, { messageId });

    if (!foundResult) {
      throw new HttpException('Transaction not found', 404);
    }

    const inputTokens = get(tokenUsage, 'usedTokens', 0);
    const inputUSD = get(tokenUsage, 'usedUSD', 0);
    const currentTokens = get(foundResult, 'tokenUsage.usedTokens', 0);
    const currentUSD = get(foundResult, 'tokenUsage.usedUSD', 0);

    set(tokenUsage, 'usedTokens', inputTokens + currentTokens);
    set(tokenUsage, 'usedUSD', inputUSD + currentUSD);

    return this.update(messageId, { tokenUsage });
  }

  find(requestId: string, documentFields: Record<string, any>, sortFields?: Record<string, any>, session?: any) {
    this.logger.log(`[${requestId}] -- Find chat transaction by document fields`);
    this.logger.verbose(`[${requestId}] -- Find chat transaction by document fields ${JSON.stringify(documentFields)}`);
    const findFn = this.transactionModel.find(documentFields);

    if (isEmpty(sortFields)) {
      findFn.sort(sortFields);
    }

    return findFn.session(session).exec();
  }

  async constructAllCollectionIdsByCurrentUser(requestId: string, currentUser: any) {
    this.logger.log(`[${requestId}] -- Construct all collection ids by current user`);
    this.logger.verbose(`[${requestId}] -- Construct all collection ids by current user ${currentUser}`);

    const pipeLine = [
      { $match: { apiTokenRef: currentUser.userApiKey } },
      // group by collectionId
      { $group: { _id: '$collectionId' } },
      { $unwind: '$_id' },
    ];
    const records = await this.transactionModel.aggregate(pipeLine).exec();

    return records.map((record) => record._id);
  }

  delete(requestId: string, documentFields: Record<string, any>) {
    this.logger.log(`[${requestId}] -- Delete chat transaction by document fields`);
    this.logger.verbose(`[${requestId}] -- Delete chat transaction by document fields ${JSON.stringify(documentFields)}`);
    return this.transactionModel.deleteOne(documentFields).exec();
  }
}
