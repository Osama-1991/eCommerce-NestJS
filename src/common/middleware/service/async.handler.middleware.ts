import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
  ContextType,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const contextType = host.getType<ContextType>();

    let status: number;
    let message: string | object;
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null && 'message' in res) {
        message = (res as any).message;
      } else {
        message = res;
      }
      stack = exception.stack;
    } else {
      const errorMessage =
        exception && typeof exception === 'object' && 'message' in exception
          ? (exception as { message: string }).message
          : 'Internal server error';
      const internalError = new InternalServerErrorException(errorMessage);
      status = internalError.getStatus();
      const res = internalError.getResponse();
      if (typeof res === 'object' && res !== null && 'message' in res) {
        message = (res as any).message;
      } else {
        message = res;
      }
      stack =
        exception && typeof exception === 'object' && 'stack' in exception
          ? (exception as { stack: string }).stack
          : undefined;
    }

    if (contextType === ('http' as ContextType)) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      response.status(status).json({
        message,
        success: false,
        path: request.url,
        ...(process.env.MODE === 'DEV' && stack && { stack }),
      });
    } else if (contextType === ('graphql' as ContextType)) {
      const gqlHost = GqlArgumentsHost.create(host);
      throw new HttpException(
        {
          message,
          statusCode: status,
          path: gqlHost.getInfo().fieldName,
          ...(process.env.MODE === 'DEV' && stack && { stack }),
        },
        status,
      );
    } else if (contextType === ('ws' as ContextType)) {
      const client = host.switchToWs().getClient();
      const data = host.switchToWs().getData();

      client.emit('error', {
        message,
        success: false,
        path: data?.event || 'unknown',
        ...(process.env.MODE === 'DEV' && stack && { stack }),
      });
    } else if (contextType === ('rpc' as ContextType)) {
      return {
        message,
        success: false,
        ...(process.env.MODE === 'DEV' && stack && { stack }),
      };
    }
  }
}
