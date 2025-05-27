import { Controller, Get, Version } from '@nestjs/common';

import { ResponseMessage } from '@app/commons/api/responseMessage.decorator';
import { ApiResponse } from '@app/commons/api/baseResponse';
import { PoolingService } from './services/pooling.service';

@Controller('pool')
export class PoolingControllers {
  constructor(private readonly poolServices: PoolingService) {}

  @Get()
  @Version('1')
  @ResponseMessage('pooling execute')
  async exec(): Promise<ApiResponse<void>> {
    await this.poolServices.runPool();

    return {
      data: null,
    };
  }
}
