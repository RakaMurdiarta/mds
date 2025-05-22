import { Controller, Get } from '@nestjs/common';
import { CompaniesService } from './services/companies.service';
import { ApiResponse } from '@app/commons/api/baseResponse';
import { ResponseMessage } from '@app/commons/api/responseMessage.decorator';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesServices: CompaniesService) {}
  @ResponseMessage('companies pooling triggered')
  @Get()
  async execPoolCompanies(): Promise<ApiResponse<void>> {
    await this.companiesServices.poolingCompanies('Company');

    return {
      data: null,
    };
  }
}
