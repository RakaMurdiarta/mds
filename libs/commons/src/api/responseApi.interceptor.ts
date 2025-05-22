import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Response } from 'express';
import { Reflector } from '@nestjs/core';
import { format } from 'date-fns';
import { ApiResponse } from './baseResponse';
import { RESPONSE_MESSAGE_METADATA } from './responseMessage.decorator';

@Injectable()
export class ResponseApiInterceptor<ResponseDataType>
  implements
    NestInterceptor<
      ApiResponse<ResponseDataType>,
      ApiResponse<ResponseDataType>
    >
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<ApiResponse<ResponseDataType>>,
  ):
    | Observable<ApiResponse<ResponseDataType>>
    | Promise<Observable<ApiResponse<ResponseDataType>>> {
    return next
      .handle()
      .pipe(
        map((res: ApiResponse<ResponseDataType>) =>
          this.responseHandler(res, context),
        ),
      );
  }

  responseHandler(
    res: ApiResponse<ResponseDataType>,
    context: ExecutionContext,
  ) {
    const message =
      this.reflector.get<string>(
        RESPONSE_MESSAGE_METADATA,
        context.getHandler(),
      ) || 'operation success';
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const statusCode = response.statusCode;

    const __response: ApiResponse<ResponseDataType> = {
      message: message,
      data: res.data,
      statusCode,
      metaData: {
        timestamp: format(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
      },
    };

    return __response;
  }
}
