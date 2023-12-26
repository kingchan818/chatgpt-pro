import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.shcema';
import { Model } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import { CustomLoggerService } from '../logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly logger: CustomLoggerService,
  ) {}

  generateApiKey() {
    return uuidV4().replace(/-/g, '');
  }

  create(requestId: string, createUserDto: CreateUserDto) {
    this.logger.log(`[${requestId}] -- Create new user`);
    const apiKey = this.generateApiKey();
    createUserDto.apiKeys = [apiKey];
    return this.userModel.create(createUserDto);
  }

  async appendNewApiKey(requestId: string) {
    this.logger.log(`[${requestId}] -- Append new API key`);
    await this.userModel
      .updateOne({
        $push: {
          apiKeys: this.generateApiKey(),
        },
      })
      .exec();
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(requestId: string, apiKey: string) {
    this.logger.log(`[${requestId}] -- Find user by API key`);
    return this.userModel.findOne({
      apiKeys: apiKey,
    });
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
