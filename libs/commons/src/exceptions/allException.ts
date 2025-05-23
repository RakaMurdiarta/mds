import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '@app/commons/api/baseResponse';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception?.response) {
      const status =
        exception.response.status ||
        exception.response?.statusCode ||
        HttpStatus.INTERNAL_SERVER_ERROR;

      const __response: ApiResponse<any> = {
        data: null,
        message: exception.response?.message ?? 'Internal server error',
        metaData: {
          timestamp: new Date().toISOString(),
        },
        statusCode: status,
      };

      return response.json(__response).status(status);
    }

    const __response: ApiResponse<any> = {
      data: null,
      message: exception.message ?? 'Internal server error',
      metaData: {
        timestamp: new Date().toISOString(),
      },
      statusCode: HttpStatus.BAD_REQUEST,
    };

    return response.json(__response).status(HttpStatus.BAD_REQUEST);
  }
}
