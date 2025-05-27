import { Module } from '@nestjs/common';
import { PoolingControllers } from './pooling.controllers';
import { CompaniesModule } from '../companies/companies.module';
import { ProjectsModule } from '../projects/projects.module';
import { CustomersModule } from '../customers/customers.module';
import { SuppliersModule } from '../suppliers/suppliers.module';
import { EnvModule } from '@env/env.module';
import { PoolingService } from './services/pooling.service';

@Module({
  imports: [
    CompaniesModule,
    ProjectsModule,
    CustomersModule,
    SuppliersModule,
    EnvModule,
  ],
  providers: [PoolingService],
  controllers: [PoolingControllers],
})
export class PoolingModule {}
