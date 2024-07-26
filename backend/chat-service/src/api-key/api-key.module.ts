import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ApiKeyService } from './api-key.service';
import { ApiKey, ApiKeySchema } from './schema/api-key.schema';
import { ApiKeyController } from './api-key.controller';
import configuration from 'src/config/configuration';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    MongooseModule.forFeature([{ name: ApiKey.name, schema: ApiKeySchema }]),
    forwardRef(() => AuthModule),
  ],
  providers: [ApiKeyService],
  exports: [ApiKeyService],
  controllers: [ApiKeyController],
})
export class ApiKeyModule {}
