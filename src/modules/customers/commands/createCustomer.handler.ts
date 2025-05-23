import { ConflictException, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DbTxService } from '@app/commons/dbTransaction/dbTx.service';
import { CreateCustomerCommand } from './createCustomer.command';
import { CustomerRepository } from '../repositories/customers.repository';

@CommandHandler(CreateCustomerCommand)
@Injectable()
export class CreateCustomerHandler
  implements ICommandHandler<CreateCustomerCommand>
{
  constructor(
    private __tx: DbTxService,
    private customersRepo: CustomerRepository,
  ) {}
  async execute(command: CreateCustomerCommand): Promise<any> {
    try {
      await this.__tx.withTx(async (manager) => {
        const customer = await this.customersRepo.findBy({
          where: {
            customerId: command.customerId,
          },
        });

        if (customer) {
          throw new ConflictException('customer already exist');
        }

        return await this.customersRepo.createCustomer(command, manager);
      });
    } catch (error) {
      throw error;
    }
  }
}
