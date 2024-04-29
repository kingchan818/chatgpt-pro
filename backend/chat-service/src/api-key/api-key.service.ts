import { Injectable } from '@nestjs/common';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { Model } from 'mongoose';
import { ApiKey } from './schema/api-key.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { generateUniqueKey } from 'src/utils';
import { CustomLoggerService } from 'src/logger/logger.service';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectModel(ApiKey.name) private readonly apiKeyModel: Model<ApiKey>,
    private readonly configService: ConfigService,
    private readonly logger: CustomLoggerService,
  ) {}

  async create(createApiKeyDto: CreateApiKeyDto, session?: any) {
    this.logger.log(`Create new API key`);
    this.logger.verbose(`Create new API key ${JSON.stringify(createApiKeyDto)}`);
    const dbModel = {
      _id: generateUniqueKey(),
      name: createApiKeyDto.name,
      usageLimit: createApiKeyDto.usageLimit || this.configService.get('user.usageLimit'),
    };

    const [dbData] = await this.apiKeyModel.create([dbModel], { session });
    return dbData;
  }

  async updateUsageCount(id: string, updateApiKeyDto: UpdateApiKeyDto, session?: any) {
    this.logger.log(`Update API key usage count`);
    this.logger.verbose(`Update API key usage count ${JSON.stringify(updateApiKeyDto)}`);
    const { usageCount: newUsageCount } = updateApiKeyDto;
    const { usageCount: oldUsageCount } = await this.findOne(id, session);
    const updatedUsageCount = oldUsageCount + newUsageCount;
    await this.update(id, { usageCount: updatedUsageCount }, session);
  }

  update(id: string, updateApiKeyDto: UpdateApiKeyDto, session: any) {
    this.logger.log(`Update API key`);
    this.logger.verbose(`Update API key ${JSON.stringify(updateApiKeyDto)}`);
    return this.apiKeyModel.findOneAndUpdate({ _id: id }, updateApiKeyDto, { new: true }).session(session).exec();
  }

  findOne(id: string, session?: any) {
    this.logger.log(`Find API key by ID`);
    this.logger.verbose(`Find API key by ID ${id}`);
    return this.apiKeyModel.findOne({ _id: id }).session(session).exec();
  }

  remove(id: string) {
    return this.apiKeyModel.deleteOne({ _id: id }).exec();
  }
}
