import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CustomLoggerService } from '../logger/logger.service';
import { ChatgptService } from '../chatgpt/chatgpt.service';
import { UserService } from '../user/user.service';

describe('AuthService', () => {
  let service: AuthService;
  let logger: CustomLoggerService;
  let chatgptService: ChatgptService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: CustomLoggerService,
          useValue: {
            log: jest.fn(),
          },
        },
        {
          provide: ChatgptService,
          useValue: {
            init: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    logger = module.get<CustomLoggerService>(CustomLoggerService);
    chatgptService = module.get<ChatgptService>(ChatgptService);
    userService = module.get<UserService>(UserService);
  });

  it('should validate user', async () => {
    const requestId = 'testRequestId';
    const apiKey = 'testApiKey';

    const userModel: any = {
      openAIToken: 'testOpenAIToken',
      apiKeys: [apiKey],
    };

    jest.spyOn(logger, 'log');
    jest.spyOn(userService, 'findOne').mockResolvedValue(userModel);

    const result = await service.validateUser(requestId, apiKey);

    expect(logger.log).toHaveBeenCalledWith(`[${requestId}] -- Validate user`);
    expect(userService.findOne).toHaveBeenCalledWith(requestId, apiKey);
    expect(result).toBe(true);
  });

  it('should validate openAIAPIKey', async () => {
    const requestId = 'testRequestId';
    const openAIAPIKey = 'testOpenAIAPIKey';

    jest.spyOn(logger, 'log');
    jest.spyOn(chatgptService, 'init').mockResolvedValue(true);

    const result = await service.validateOpenAIAPIKey(requestId, openAIAPIKey);

    expect(logger.log).toHaveBeenCalledWith(`[${requestId}] -- Validate openAIAPIKey`);
    expect(chatgptService.init).toHaveBeenCalledWith(openAIAPIKey);
    expect(result).toBe(true);
  });
});
