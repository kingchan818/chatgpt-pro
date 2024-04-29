import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Request, Response } from 'express';
import { set } from 'lodash';

@Catch(MongoError)
export class MongoExceptionFilter extends HttpException implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const responseObj = {};
    switch (exception.code) {
      case 11000:
        set(responseObj, 'mongodbErrorCode', exception.code);
        set(responseObj, 'timestamp', new Date().toISOString());
        set(responseObj, 'path', request.url);
        set(responseObj, 'message', 'Duplicate key error');
        break;
      default:
        set(responseObj, 'mongodbErrorCode', exception.code);
        set(responseObj, 'message', exception.message);
        set(responseObj, 'timestamp', new Date().toISOString());
        set(responseObj, 'path', request.url);
        break;
    }
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(responseObj);
  }
}
