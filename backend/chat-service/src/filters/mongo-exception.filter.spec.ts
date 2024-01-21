import { Test } from '@nestjs/testing';
import { MongoExceptionFilter } from './mongo-exception.filter';
import { MongoError } from 'mongodb';
import { ArgumentsHost } from '@nestjs/common';

describe('MongoExceptionFilter', () => {
  let filter: MongoExceptionFilter;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [MongoExceptionFilter],
    }).compile();

    filter = moduleRef.get<MongoExceptionFilter>(MongoExceptionFilter);
  });

  it('should handle duplicate key error', () => {
    const exception = new MongoError('Exception');
    exception.code = 11000;

    const request = {
      url: '/test',
    };

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    };

    filter.catch(exception, host as unknown as ArgumentsHost);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      mongodbErrorCode: 11000,
      path: '/test',
      timestamp: expect.any(String),
      message: 'Duplicate key error',
    });
  });

  it('should handle other mongodb errors', () => {
    const exception = new MongoError('Exception');
    exception.code = 12345; // some different error code

    const request = {
      url: '/test',
    };

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    };

    filter.catch(exception, host as unknown as ArgumentsHost);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      mongodbErrorCode: 12345,
      path: '/test',
      timestamp: expect.any(String),
    });
  });
});
