import { Test, TestingModule } from '@nestjs/testing';
import { RequestInterceptor } from './request.interceptor';
import { CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { CustomLoggerService } from '../logger/logger.service';
import { AuthService } from '../auth/auth.service';

describe('RequestInterceptor', () => {
  let interceptor: RequestInterceptor;
  let logger: CustomLoggerService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestInterceptor,
        {
          provide: CustomLoggerService,
          useValue: {
            log: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    interceptor = module.get<RequestInterceptor>(RequestInterceptor);
    logger = module.get<CustomLoggerService>(CustomLoggerService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should add the user agent to the request object', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { 'user-agent': 'test-agent' },
          connection: { remoteAddress: '127.0.0.1' },
          userAgent: 'test-agent',
        }),
      }),
      getClass: () => ({ name: 'TestClass' }),
      getHandler: () => ({ name: 'testHandler' }),
    };
    const next: CallHandler = {
      handle: () => new Observable(),
    };

    interceptor.intercept(context as any, next);

    expect(context.switchToHttp().getRequest().userAgent).toBeDefined();
    expect(context.switchToHttp().getRequest().userAgent).toBe('test-agent');
  });

  it('should validate and add the API key to the request object', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { 'x-auth-key': 'test-token' },
          requestId: 'test-id',
          apiKey: 'test-token',
          connection: { remoteAddress: '127.0.0.1' },
        }),
      }),
      getClass: () => ({ name: 'TestClass' }),
      getHandler: () => ({ name: 'testHandler' }),
    };
    const next: CallHandler = {
      handle: () => new Observable(),
    };

    jest.spyOn(authService, 'validateUser').mockReturnValue(Promise.resolve(true));

    interceptor.intercept(context as any, next);

    expect(context.switchToHttp().getRequest().apiKey).toBeDefined();
    expect(context.switchToHttp().getRequest().apiKey).toBe('test-token');
  });

  it('should call the log method correctly at the start and end of a request', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
          connection: { remoteAddress: '127.0.0.1' },
          method: 'GET',
          url: '/test',
          params: {},
          body: {},
          requestId: 'test-id',
        }),
      }),
      getClass: () => ({ name: 'TestClass' }),
      getHandler: () => ({ name: 'testHandler' }),
    };
    const next: CallHandler = {
      handle: () => of(null), // Emit null and then complete
    };

    const spy = jest.spyOn(logger, 'log');

    interceptor.intercept(context as any, next).subscribe({
      complete: () => {
        const logStart = `[${context.getClass().name}.${context.getHandler().name}] START [`;
        const logEnd = `[${context.getClass().name}.${context.getHandler().name}] END [`;

        expect(spy.mock.calls[0][0]).toContain(logStart);
        expect(spy.mock.calls[1][0]).toContain(logEnd);

        done();
      },
    });
  });
});
