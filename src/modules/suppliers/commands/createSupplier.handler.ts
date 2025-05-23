import { ConflictException, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DbTxService } from '@app/commons/dbTransaction/dbTx.service';
import { CreateSupplierCommand } from './createSupplier.command';
import { SupplierRepository } from '../repositories/suppliers.repository';

@CommandHandler(CreateSupplierCommand)
@Injectable()
export class CreateSupplierHandler
  implements ICommandHandler<CreateSupplierCommand>
{
  constructor(
    private __tx: DbTxService,
    private suppliersRepo: SupplierRepository,
  ) {}
  async execute(command: CreateSupplierCommand): Promise<any> {
    try {
      await this.__tx.withTx(async (manager) => {
        const supplier = await this.suppliersRepo.findBy({
          where: {
            supplierId: command.supplierId,
          },
        });

        if (supplier) {
          throw new ConflictException('supplier already exist');
        }

        return await this.suppliersRepo.createSupplier(command, manager);
      });
    } catch (error) {
      throw error;
    }
  }
}
