import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { UserModule } from 'src/user/user.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { AuthService } from 'src/auth/auth.service';
import { ChatgptModule } from 'src/chatgpt/chatgpt.module';
import { ApiKeyModule } from 'src/api-key/api-key.module';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration] }), UserModule, TransactionModule, ChatgptModule, ApiKeyModule],
  controllers: [ChatController],
  providers: [AuthService, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
