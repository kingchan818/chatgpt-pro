import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Request, Response } from 'express';

@Catch(MongoError)
export class MongoExceptionFilter
  extends HttpException
  implements ExceptionFilter
{
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      mongodbErrorCode: exception.code,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
