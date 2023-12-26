import { Module } from '@nestjs/common';
import { ChatgptService } from './chatgpt.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration] })],
  providers: [ChatgptService],
  exports: [ChatgptService],
})
export class ChatgptModule {}
