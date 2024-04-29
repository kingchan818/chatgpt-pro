import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { ChatgptModule } from '../chatgpt/chatgpt.module';
import configuration from '../config/configuration';
import { ApiKeyModule } from 'src/api-key/api-key.module';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration] }), ChatgptModule, UserModule, ApiKeyModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
