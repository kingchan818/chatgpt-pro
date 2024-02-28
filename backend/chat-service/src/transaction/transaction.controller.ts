import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { TransactionGuard } from './transaction.guard';
import { TransactionService } from './transaction.service';

@UseGuards(TransactionGuard)
@Controller('transaction')
export class TransactionController {
  // CRUD operations for transaction
  constructor(private transactionService: TransactionService) {}

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
}
