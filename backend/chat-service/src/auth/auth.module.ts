import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { ChatgptModule } from '../chatgpt/chatgpt.module';
import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    ChatgptModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
