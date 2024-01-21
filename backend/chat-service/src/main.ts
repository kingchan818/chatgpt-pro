import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(CustomLoggerService));
  const configuration = app.get(ConfigService);
  app.enableCors(configuration.get<object>('http.cors'));
  await app.listen(configuration.get<number>('http.port'));
}
bootstrap();
