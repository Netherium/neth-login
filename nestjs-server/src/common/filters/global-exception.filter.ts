import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CannotCreateEntityIdMapError, EntityNotFoundError, QueryFailedError } from 'typeorm';
import { GlobalResponseErrorHelper } from '../helpers/global-response-error.helper';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    GlobalExceptionFilter.logError(exception, ctx);

    let statusCode: number;
    let message: string;
    let error: string[] = null;
    switch (true) {
      case exception instanceof HttpException: {
        statusCode = (exception as HttpException).getStatus();
        message = (exception as HttpException).message;
        const errorResponse = (exception as HttpException).getResponse() as any;
        if (errorResponse && errorResponse.error) {
          error = errorResponse.message;
          message = errorResponse.error;
        }
        break;
      }
      case exception.constructor === EntityNotFoundError:
      case exception.constructor === CannotCreateEntityIdMapError:
      case exception.constructor === QueryFailedError: {
        const exceptionInstance = new UnprocessableEntityException();
        statusCode = exceptionInstance.getStatus();
        message = exceptionInstance.message;
        break;
      }
      default: {
        const exceptionInstance = new InternalServerErrorException();
        statusCode = exceptionInstance.getStatus();
        message = exceptionInstance.message;
        break;
      }
    }

    response.status(statusCode).json(GlobalResponseErrorHelper(statusCode, message, error));
  }

  private static logError(exception: unknown, ctx: HttpArgumentsHost): void {
    const request = ctx.getRequest<Request>();
    const message = (exception as any).message.message;

    Logger.error(message, (exception as any).stack, `${request.method} ${request.url}`);
  }
}
