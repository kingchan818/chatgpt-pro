import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { CustomLoggerModule } from './logger/logger.module';
import { CustomLoggerService } from './logger/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('mongodb.host');
        const port = configService.get('mongodb.port');
        const database = configService.get<string>('mongodb.database');
        return {
          uri: `mongodb://${host}:${port}/${database}`,
          directConnection: true,
        };
      },
      inject: [ConfigService],
    }),
    CustomLoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
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
