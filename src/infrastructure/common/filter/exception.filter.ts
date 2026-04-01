/* eslint-disable prettier/prettier */
interface IError {
  message: string;
  code_error: string;
}
import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { FastifyRequest } from 'fastify';

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    console.log(`error der`);
    const ctx = host.switchToRpc();
    const call = ctx.getContext(); // gRPC call context
    const metadata = ctx.getData(); // Metadata from the gRPC call

    console.log(`Filter call`, call);
    console.log(`Filter metadata`, metadata);

    if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse();
      let message: string = errorResponse['message'];
      if (
        errorResponse['message'] != undefined &&
        typeof errorResponse['message'] === 'object'
      ) {
        message = errorResponse['message'].find((item) => item);
      }
      const error = {
        code: status.INVALID_ARGUMENT,
        message: message || 'Invalid argument',
        details: errorResponse,
      };
      throw error;
    }
    const error = {
      code: status.INVALID_ARGUMENT,
      message: exception?.message || 'Internal server error',
      details: exception,
    };
    throw error;
  }

  private logMessage(
    request: FastifyRequest,
    message: IError,
    status: number,
    exception: any,
  ) {
    if (status === 500) {
      this.logger.error(
        `End Request for ${request.url}`,
        `method=${request.method} status=${status} code_error=${
          message.code_error ? message.code_error : null
        } message=${message.message ? message.message : null}`,
        status >= 500 ? exception.stack : '',
      );
    } else {
      this.logger.warn(
        `End Request for ${request.url}`,
        `method=${request.method} status=${status} code_error=${
          message.code_error ? message.code_error : null
        } message=${message.message ? message.message : null}`,
      );
    }
  }
}