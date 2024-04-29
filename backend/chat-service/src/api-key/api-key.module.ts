import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ApiKeyService } from './api-key.service';
import { ApiKey, ApiKeySchema } from './schema/api-key.schema';
import configuration from 'src/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    MongooseModule.forFeature([{ name: ApiKey.name, schema: ApiKeySchema }]),
  ],
  providers: [ApiKeyService],
  exports: [ApiKeyService],
})
export class ApiKeyModule {}
