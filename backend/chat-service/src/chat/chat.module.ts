import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatgptService } from 'src/chatgpt/chatgpt.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { UserModule } from 'src/user/user.module';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration] }), UserModule, TransactionModule],
  controllers: [ChatController],
  providers: [ChatService, ChatgptService],
  exports: [ChatService],
})
export class ChatModule {}
