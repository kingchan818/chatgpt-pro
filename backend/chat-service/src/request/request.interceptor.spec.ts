import { Test, TestingModule } from '@nestjs/testing';
import { RequestInterceptor } from './request.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

describe('RequestInterceptor', () => {
  let interceptor: RequestInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestInterceptor],
    }).compile();

    interceptor = module.get<RequestInterceptor>(RequestInterceptor);
  });

  it('should add a unique ID to the request object', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          requestId: null,
        }),
      }),
    };
    const next: CallHandler = {
      handle: () => new Observable(),
    };

    interceptor.intercept(context as any, next);

    expect(context.switchToHttp().getRequest().requestId).toBeDefined();
  });

  it('should add a timestamp to the request object', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          now: null
        }),
      }),
    };
    const next: CallHandler = {
      handle: () => new Observable(),
    };

    interceptor.intercept(context as any, next);

    expect(context.switchToHttp().getRequest().now).toBeDefined();
  });
});