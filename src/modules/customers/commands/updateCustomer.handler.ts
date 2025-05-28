import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { DbTxService } from '@app/commons/dbTransaction/dbTx.service';

import { UpdateCustomerCommand } from './updateCustomer.command';
import { CustomerRepository } from '../repositories/customers.repository';
import { Not } from 'typeorm';

@CommandHandler(UpdateCustomerCommand)
@Injectable()
export class UpdateCustomerHandler
  implements ICommandHandler<UpdateCustomerCommand>
{
  constructor(
    private __tx: DbTxService,
    private customersRepo: CustomerRepository,
  ) {}
  async execute(command: UpdateCustomerCommand): Promise<any> {
    try {
      const isConflict = await this.customersRepo.findBy({
        where: {
          customerId: Not(command.customerId),
          name: command.name,
        },
      });

      if (isConflict) {
        return;
      }

      const customer = await this.customersRepo.findBy({
        where: {
          customerId: command.customerId,
        },
      });

      await this.__tx.withTx(async (manager) => {
        return await this.customersRepo.updateCustomer(
          command,
          customer,
          manager,
        );
      });
    } catch (error) {
      throw error;
    }
  }
}
