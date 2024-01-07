import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { CustomLoggerModule } from './logger/logger.module';
import { CustomLoggerService } from './logger/logger.service';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { RequestInterceptor } from './request/request.interceptor';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { MongoExceptionFilter } from './filters/mongo-exception.filter';
import { TransactionModule } from './transaction/transaction.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
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
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              logger.log('Mongodb connected');
            });
            connection.on('error', (err) => {
              logger.log('Mongodb error', err);
            });
            connection.on('disconnected', () => {
              logger.log('Mongodb disconnected');
            });
            return connection;
          },
          ...mongoOptions,
        };
      },
      inject: [ConfigService, CustomLoggerService],
    }),
    CustomLoggerModule,
    AuthModule,
    UserModule,
    TransactionModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestInterceptor,
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
