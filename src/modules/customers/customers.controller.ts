import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@app/commons/api/baseResponse';
import { ResponseMessage } from '@app/commons/api/responseMessage.decorator';
import { CustomerServices } from './services/customer.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customerServices: CustomerServices) {}
  @ResponseMessage('customer pooling triggered')
  @Get()
  async execPoolCustomers(): Promise<ApiResponse<void>> {
    // await this.customerServices.poolingCustomers('Customer');

    return {
      data: null,
    };
  }
}
