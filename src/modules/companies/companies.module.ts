import { Module } from '@nestjs/common';
import { CompaniesRepository } from './repositories/companiesRepository';
import { CompaniesService } from './services/companies.service';
import { EnvModule } from '@env/env.module';
import { CompaniesController } from './companies.controller';
import { CreateCompanyHandler } from './commands/createCompany.handler';
import { UpdateCompanyHandler } from './commands/updateCompany.handler';
import { DBTransactionModule } from '@app/commons/dbTransaction/dbTx.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ExOutBoxModule } from '@app/commons/external/exOutBox.module';

@Module({
  imports: [EnvModule, DBTransactionModule, CqrsModule, ExOutBoxModule],
  providers: [
    CompaniesRepository,
    CompaniesService,
    UpdateCompanyHandler,
    CreateCompanyHandler,
  ],
  controllers: [CompaniesController],
  exports: [CompaniesRepository],
})
export class CompaniesModule {}
