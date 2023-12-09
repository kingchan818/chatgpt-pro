import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { CustomLoggerModule } from './logger/logger.module';
import { CustomLoggerService } from './logger/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
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
    this.logger.log(
      `Running in ${process.env.ENV || 'dev'} mode`,
      AppModule.name,
    );

    this.logger.log(
      `Listening on port ${this.configureService.get<number>('http.port')}`,
      AppModule.name,
    );
  }
}
