import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.useLogger(app.get(CustomLoggerService));
  const configuration = app.get(ConfigService);

  await app.listen(configuration.get<number>('http.port'));
}
bootstrap();
