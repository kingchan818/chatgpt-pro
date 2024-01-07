import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CustomLoggerService } from '../logger/logger.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.shcema';
import { generateUniqueKey } from '../utils';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly logger: CustomLoggerService,
  ) {}

  create(requestId: string, createUserDto: CreateUserDto) {
    this.logger.log(`[${requestId}] -- Create new user`);
    const apiKey = generateUniqueKey();
    createUserDto.apiKeys = [apiKey];
    return this.userModel.create(createUserDto);
  }

  async appendNewApiKey(requestId: string) {
    this.logger.log(`[${requestId}] -- Append new API key`);
    await this.userModel
      .updateOne({
        $push: {
          apiKeys: generateUniqueKey(),
        },
      })
      .exec();
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(requestId: string, documentFields: Record<string, any>) {
    this.logger.log(`[${requestId}] -- Find user by document fields`);
    return this.userModel.findOne(documentFields);
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
