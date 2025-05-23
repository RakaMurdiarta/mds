import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@app/commons/api/baseResponse';
import { ResponseMessage } from '@app/commons/api/responseMessage.decorator';
import { SupplierServices } from './services/suppliers.service';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersServices: SupplierServices) {}
  @ResponseMessage('suppliers pooling triggered')
  @Get()
  async execPoolCompanies(): Promise<ApiResponse<void>> {
    await this.suppliersServices.poolingSuppliers('Supplier');

    return {
      data: null,
    };
  }
}
