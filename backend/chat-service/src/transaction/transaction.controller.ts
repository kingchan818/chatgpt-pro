import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { TransactionGuard } from './transaction.guard';
import { TransactionService } from './transaction.service';
import { getTransactionDto } from './dto/get-transaction.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@UseGuards(TransactionGuard)
@Controller('transaction')
export class TransactionController {
  // CRUD operations for transaction
  constructor(
    private transactionService: TransactionService,
    @InjectConnection() private connection: Connection,
  ) {}

  @Get('')
  constructAllCollectionIdsByCurrentUser(@Req() req: any) {
    const { currentUser, requestId } = req;
    return this.transactionService.constructAllCollectionIdsByCurrentUser(requestId, currentUser);
    // get all collection ids by current user
  }

  @Get('get/:collectionId')
  getChatHistoryByCollectionId(@Req() req: any, @Param('collectionId') collectionId: string) {
    // get chat history by collection id
    return this.transactionService.find(req.requestId, { collectionId });
  }

  @Delete(':collectionId')
  deleteChatHistoryByCollectionId(@Req() req: any, @Param('collectionId') collectionId: string) {
    // delete chat history by collection id
    return this.transactionService.delete(req.requestId, { collectionId });
  }

  @Post('usage')
  async queryAndCountUserUsageWithinCertainDateRange(@Req() req: any, @Body('filters') filters: getTransactionDto) {
    const dateRangeChunks = this.transactionService.splitUserUsageChunksInDateRange(req, filters);
    const promises = dateRangeChunks.map((val) => {
      return this.transactionService.countUserUsageByDateRange(req, val);
    });
    const PromiseResult = await Promise.allSettled(promises);

    const result = PromiseResult.map((val) => {
      if (val.status === 'fulfilled') {
        return val.value;
      }
      return val;
    });
    return result;
  }
}
