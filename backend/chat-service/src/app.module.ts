import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import configuration from './config/configuration';
import { MongoExceptionFilter } from './filters/mongo-exception.filter';
import { CustomLoggerModule } from './logger/logger.module';
import { CustomLoggerService } from './logger/logger.service';
import { RequestInterceptor } from './request/request.interceptor';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
import { ChatgptModule } from './chatgpt/chatgpt.module';
import { ApiKeyModule } from './api-key/api-key.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService, logger: CustomLoggerService) => {
        const uris = configService.get<string>('mongodb.uris');
        const database = configService.get<string>('mongodb.database');
        const replicaSet = configService.get<string>('mongodb.replicaSet');
        const mongoOptions: any = configService.get<string>('mongodb.options');
        logger.log('Connecting to mongodb....', AppModule.name);
        return {
          uri: uris,
          dbName: database,
          replicaSet,
          ...mongoOptions,
        };
      },
      inject: [ConfigService, CustomLoggerService],
    }),
    CustomLoggerModule,
    AuthModule,
    UserModule,
    ChatModule,
    TransactionModule,
    ChatgptModule,
    ApiKeyModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestInterceptor,
    },
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe(),
    },
    {
      provide: APP_FILTER,
      useClass: MongoExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {
  constructor(
    private configureService: ConfigService,
    private logger: CustomLoggerService,
  ) {
    this.logger.log(`Running in ${process.env.ENV || 'dev'} mode`, AppModule.name);

    this.logger.log(`Listening on port ${this.configureService.get<number>('http.port')}`, AppModule.name);
  }
}
