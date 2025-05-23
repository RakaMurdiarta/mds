import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EnvModule } from '@env/env.module';
import { DBTransactionModule } from '@app/commons/dbTransaction/dbTx.module';
import { ExOutBoxModule } from '@app/commons/external/exOutBox.module';
import { CustomerRepository } from './repositories/customers.repository';
import { UpdateCustomerHandler } from './commands/updateCustomer.handler';
import { CreateCustomerHandler } from './commands/createCustomer.handler';
import { CustomersController } from './customers.controller';
import { CustomerServices } from './services/customer.service';
@Module({
  imports: [EnvModule, DBTransactionModule, CqrsModule, ExOutBoxModule],
  providers: [
    UpdateCustomerHandler,
    CreateCustomerHandler,
    CustomerRepository,
    CustomerServices,
  ],
  controllers: [CustomersController],
})
export class CustomersModule {}
