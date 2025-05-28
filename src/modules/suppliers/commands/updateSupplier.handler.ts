import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { DbTxService } from '@app/commons/dbTransaction/dbTx.service';
import { UpdateSupplierCommand } from './updateSupplier.command';
import { SupplierRepository } from '../repositories/suppliers.repository';
import { Not } from 'typeorm';

@CommandHandler(UpdateSupplierCommand)
@Injectable()
export class UpdateSupplierHandler
  implements ICommandHandler<UpdateSupplierCommand>
{
  constructor(
    private __tx: DbTxService,
    private suppliersRepo: SupplierRepository,
  ) {}
  async execute(command: UpdateSupplierCommand): Promise<any> {
    try {
      const isConflict = await this.suppliersRepo.findBy({
        where: {
          supplierId: Not(command.supplierId),
          name: command?.name,
        },
      });

      if (isConflict) {
        return;
      }

      const supplier = await this.suppliersRepo.findBy({
        where: {
          supplierId: command.supplierId,
        },
      });

      await this.__tx.withTx(async (manager) => {
        return await this.suppliersRepo.updateSupplier(
          command,
          supplier,
          manager,
        );
      });
    } catch (error) {
      throw error;
    }
  }
}
