import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { DbTxService } from '@app/commons/dbTransaction/dbTx.service';

import { UpdateCustomerCommand } from './updateCustomer.command';
import { CustomerRepository } from '../repositories/customers.repository';

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
      const customer = await this.customersRepo.findBy({
        where: {
          customerId: command.customerId,
        },
      });

      if (!customer) {
        return;
      }

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
