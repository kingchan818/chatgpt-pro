import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;
  let userService: UserService;
  let authService: AuthService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            appendNewApiKey: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            validateOpenAIAPIKey: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('registerOpenAPIKey', () => {
    it('should create a new user and return the API key if the provided OpenAI API key is valid', async () => {
      // Arrange
      const requestId = 'test-request-id';
      const openAIAPIKey = 'valid-api-key';
      const user: any = { apiKeys: ['api-key'] };
      const configSpy = jest.spyOn(configService, 'get').mockReturnValue('salt');
      const createSpy = jest.spyOn(userService, 'create').mockResolvedValue(user);
      const validateSpy = jest.spyOn(authService, 'validateOpenAIAPIKey').mockResolvedValue(true);

      // Act
      const result = await controller.registerOpenAPIKey({ requestId }, { openAIAPIKey });

      // Assert
      expect(configSpy).toHaveBeenCalledWith('salt');
      expect(validateSpy).toHaveBeenCalledWith(requestId, openAIAPIKey);
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ apiKey: user.apiKeys[0] });
    });

    it('should throw an HttpException with status 400 if the provided OpenAI API key is invalid', async () => {
      // Arrange
      const requestId = 'test-request-id';
      const openAIAPIKey = 'invalid-api-key';
      const validateSpy = jest.spyOn(authService, 'validateOpenAIAPIKey').mockResolvedValue(false);

      // Act & Assert
      await expect(controller.registerOpenAPIKey({ requestId }, { openAIAPIKey })).rejects.toThrowError(
        new HttpException('Unknow Error', HttpStatus.BAD_REQUEST),
      );
      expect(validateSpy).toHaveBeenCalledWith(requestId, openAIAPIKey);
    });
  });

  describe('genNewApiKey', () => {
    it('should append a new API key to the user and return the latest API key if an API key is provided', async () => {
      // Arrange
      const requestId = 'test-request-id';
      const apiKey = 'existing-api-key';
      const user: any = { apiKeys: ['api-key-1', 'api-key-2'] };
      const appendSpy = jest.spyOn(userService, 'appendNewApiKey');
      const findOneSpy = jest.spyOn(userService, 'findOne').mockResolvedValue(user);

      // Act
      const result = await controller.genNewApiKey({ requestId, apiKey });

      // Assert
      expect(appendSpy).toHaveBeenCalledWith(requestId);
      expect(findOneSpy).toHaveBeenCalledWith(requestId, apiKey);
      expect(result).toEqual({ apiKey: user.apiKeys[user.apiKeys.length - 1] });
    });

    it('should throw an HttpException with status 500 if an API key is not provided', async () => {
      // Arrange
      const requestId = 'test-request-id';

      // Act & Assert
      await expect(controller.genNewApiKey({ requestId })).rejects.toThrowError(
        new HttpException('Unknow Error', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });
});
