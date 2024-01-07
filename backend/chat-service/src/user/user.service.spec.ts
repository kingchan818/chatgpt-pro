import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schema/user.shcema';
import { CustomLoggerService } from '../logger/logger.service';
import configuration from '../config/configuration';
import { ConfigModule } from '@nestjs/config';

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [configuration] })],
      providers: [
        UserService,
        {
          provide: CustomLoggerService,
          useValue: {
            log: jest.fn(),
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn().mockResolvedValue({}),
            findOne: jest.fn().mockReturnThis(),
            updateOne: jest.fn().mockImplementation(() => ({
              exec: jest.fn(),
            })),
            overwrite: jest.fn().mockReturnThis(),
            deleteOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        /* provide test data */
        openAIToken: 'openAIToken',
        apiKeys: [],
      };
      const objectId = new Types.ObjectId();
      const createdUser = {
        _id: objectId,
        openAIToken: 'openAIToken',
        apiKeys: [],
        // add other User properties here
      } as unknown as User;
      jest.spyOn(userModel, 'create').mockResolvedValueOnce(createdUser as any);
      const result = await service.create('requestId', createUserDto);
      expect(userModel.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('appendNewApiKey', () => {
    it('should append a new API key to the user', async () => {
      const apiKey = 'newApiKey';
      jest.spyOn(service, 'generateApiKey').mockReturnValue(apiKey);
      const updateOneMock = {
        exec: jest.fn().mockResolvedValue({
          _id: new Types.ObjectId(),
          openAIToken: 'openAIToken',
        }),
      };
      jest.spyOn(userModel, 'updateOne').mockReturnValue(updateOneMock as any);

      await service.appendNewApiKey('requestId');

      expect(service.generateApiKey).toHaveBeenCalled();
      expect(userModel.updateOne).toHaveBeenCalledWith({
        $push: { apiKeys: apiKey },
      });
      expect(updateOneMock.exec).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users', () => {
      const result = service.findAll();
      expect(result).toEqual('This action returns all user');
    });
  });

  describe('findOne', () => {
    it('should find a user by API key', async () => {
      const apiKey = 'apiKey';
      const foundUser = {
        /* provide found user */
      };
      jest.spyOn(userModel, 'findOne').mockResolvedValue(foundUser);

      const result = await service.findOne('requestId', { apiKey });

      expect(userModel.findOne).toHaveBeenCalledWith({ apiKey: apiKey });
      expect(result).toEqual(foundUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: any = {
        /* provide update data */
      };
      const foundUser: any = {
        overwrite: jest.fn().mockReturnThis(),
        save: jest.fn(),
        /* provide found user */
      };
      const updatedUser: any = {
        save: jest.fn(),
        /* provide updated user */
      };
      jest.spyOn(userModel, 'findOne').mockResolvedValue(foundUser);
      jest.spyOn(foundUser, 'overwrite').mockReturnValue(updatedUser);
      jest.spyOn(updatedUser, 'save').mockResolvedValue(updatedUser);

      const result = await service.update('requestId', updateUserDto);

      expect(userModel.findOne).toHaveBeenCalledWith({
        apiKeys: updateUserDto.apiKey,
      });
      expect(foundUser.overwrite).toHaveBeenCalledWith(updateUserDto);
      expect(updatedUser.save).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });
  });

  describe('removeUser', () => {
    it('should remove a user', async () => {
      const apiKey = 'apiKey';
      jest.spyOn(userModel, 'deleteOne').mockResolvedValue({
        /* provide delete result */
      } as any);

      const result = await service.removeUser('requestId', apiKey);

      expect(userModel.deleteOne).toHaveBeenCalledWith({ apiKeys: apiKey });
      expect(result).toEqual({
        /* provide expected delete result */
      });
    });
  });
});
