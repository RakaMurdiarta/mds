import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EnvModule } from '@env/env.module';
import { DBTransactionModule } from '@app/commons/dbTransaction/dbTx.module';
import { ExOutBoxModule } from '@app/commons/external/exOutBox.module';
import { SupplierRepository } from './repositories/suppliers.repository';
import { SupplierServices } from './services/suppliers.service';
import { UpdateSupplierHandler } from './commands/updateSupplier.handler';
import { CreateSupplierHandler } from './commands/createSupplier.handler';
import { SuppliersController } from './suppliers.controller';

@Module({
  imports: [EnvModule, DBTransactionModule, CqrsModule, ExOutBoxModule],
  providers: [
    SupplierServices,
    SupplierRepository,
    UpdateSupplierHandler,
    CreateSupplierHandler,
  ],
  exports: [],
  controllers: [SuppliersController],
})
export class SuppliersModule {}
