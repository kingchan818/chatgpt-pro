import { MongoExceptionFilter } from './mongo-exception.filter';
import { MongoError } from 'mongodb';
import { ArgumentsHost } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { Request, Response } from 'express';

describe('MongoExceptionFilter', () => {
  let filter: MongoExceptionFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongoExceptionFilter],
    }).compile();

    filter = module.get<MongoExceptionFilter>(MongoExceptionFilter);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should catch exceptions', () => {
      const error = new MongoError('error');
      const argumentsHost = createMock<ArgumentsHost>();
      const request = createMock<Request>();
      const response = createMock<Response>();

      request.url = '/test/url';

      argumentsHost.switchToHttp = jest.fn().mockReturnValue({
        getResponse: () => response,
        getRequest: () => request,
      });

      response.status = jest.fn().mockReturnThis();
      response.json = jest.fn().mockReturnThis();

      filter.catch(error, argumentsHost);

      expect(argumentsHost.switchToHttp).toBeCalled();
      expect(response.status).toBeCalledWith(500);
      expect(response.json).toBeCalledWith({
        mongodbErrorCode: error.code,
        timestamp: expect.any(String),
        path: expect.any(String),
        message: expect.any(String),
      });
    });
  });
});
