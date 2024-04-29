import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CustomLoggerService } from '../logger/logger.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.shcema';
import { ApiKeyService } from 'src/api-key/api-key.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly logger: CustomLoggerService,
    private readonly apiKeyService: ApiKeyService,
  ) {}

  async create(requestId: string, createUserDto: CreateUserDto, mongoSession?: any) {
    this.logger.log(`[${requestId}] -- Create new user`);

    const dbModel = {
      openAIToken: createUserDto.openAIToken,
      apiKeys: [createUserDto?.apiKeys[0]],
    };
    return this.userModel.create([dbModel], { session: mongoSession });
  }

  async appendNewApiKey(requestId: string, createUserDto?: CreateUserDto) {
    this.logger.log(`[${requestId}] -- Append new API key`);
    const { _id: apiKey } = await this.apiKeyService.create({ name: createUserDto.username || 'admin' });
    await this.userModel.updateOne({ $push: { apiKeys: apiKey } }).exec();
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(requestId: string, documentFields: Record<string, any>) {
    this.logger.log(`[${requestId}] -- Find user by document fields`);
    return this.userModel.findOne(documentFields);
  }

  checkUserUsageLimit(requestId: string, apiKey: string) {
    this.logger.log(`[${requestId}] -- Check user usage limit`);
    return this.userModel.findOne({ apiKeys: apiKey });
  }

  async update(requestId: string, updateUserDto: UpdateUserDto) {
    this.logger.log(`[${requestId}] -- Update user`);
    const foundUser = await this.userModel.findOne({
      apiKeys: updateUserDto.apiKey,
    });
    delete updateUserDto.apiKey;
    return foundUser.overwrite(updateUserDto).save();
  }

  removeUser(requestId: string, apiKey: string) {
    this.logger.log(`[${requestId}] -- Remove user`);
    return this.userModel.deleteOne({ apiKeys: apiKey });
  }
}
