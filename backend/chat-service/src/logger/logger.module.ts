import { Global, Module } from '@nestjs/common';
import { CustomLoggerService } from './logger.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ load: [configuration] })],
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class CustomLoggerModule {}
