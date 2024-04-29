import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './schema/user.shcema';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { ApiKeyModule } from 'src/api-key/api-key.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ApiKeyModule,
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
