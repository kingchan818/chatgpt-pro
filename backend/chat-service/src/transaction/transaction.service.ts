import { Model } from 'mongoose';

import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { get, isEmpty, omit, range, set } from 'lodash';
import { CustomLoggerService } from '../logger/logger.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './schema/transaction.schema';
import { getTransactionDto, TimeUnit } from './dto/get-transaction.dto';
import * as moment from 'moment';

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

  async countUserUsageByDateRange(req: any, transactionDto: getTransactionDto) {
    const referenceDateFormatMap = {
      month: 'MMM',
      week: 'dddd',
      day: 'Do',
    };
    const referenceDate = moment(transactionDto.toDate).format(referenceDateFormatMap[transactionDto.unit]);
    const pipeline = [
      {
        $match: {
          createdDT: {
            $gte: transactionDto.fromDate,
            $lte: transactionDto.toDate,
          },
          apiTokenRef: req.currentUser.userApiKey,
        },
      },
      {
        $group: {
          _id: '$apiTokenRef',
          usage: { $sum: '$tokenUsage.usedUSD' },
        },
      },
      {
        $project: {
          usage: 1,
        },
      },
    ];

    const [dbData] = await this.transactionModel.aggregate(pipeline).sort({ createdDT: 1 }).session(req.session).exec();

    // omit the user apiKey
    return { ...omit(dbData, '_id'), referenceDate, usage: get(dbData, 'usage', 0) };
  }

  splitUserUsageChunksInDateRange(req: any, transactionDto: getTransactionDto) {
    this.logger.log(`[${req.requestId}] -- Count user usage chat in dateRange`, JSON.stringify(transactionDto));
    if (!req.currentUser?.userApiKey) {
      this.logger.verbose(`[${req.requestId}] -- Empty user api key`);
    }

    const fromDate = moment(transactionDto.fromDate);
    const toDate = moment(transactionDto.toDate);
    let diff;

    switch (transactionDto.unit) {
      case TimeUnit.DAY:
        diff = toDate.diff(fromDate, 'days');
        break;
      case TimeUnit.WEEK:
        diff = toDate.diff(fromDate, 'weeks');
        break;
      case TimeUnit.MONTH:
        diff = toDate.diff(fromDate, 'months');
        break;
    }

    const counterRangeArray = range(diff);
    const dayRangeChunks = [];

    let lastRefDate;
    counterRangeArray.forEach((val, idx) => {
      if (idx === 0) {
        lastRefDate = moment(fromDate).add(1, transactionDto.unit).endOf(transactionDto.unit).toISOString();
        dayRangeChunks.push({
          fromDate: moment(fromDate).toISOString(),
          toDate: lastRefDate,
          unit: transactionDto.unit,
        });
        return true;
      }
      const tmp = moment(lastRefDate).add(1, transactionDto.unit).endOf(transactionDto.unit).toISOString();
      dayRangeChunks.push({
        fromDate: moment(lastRefDate).toISOString(),
        toDate: tmp,
        unit: transactionDto.unit,
      });

      lastRefDate = tmp;
    });

    return dayRangeChunks;
  }
}
