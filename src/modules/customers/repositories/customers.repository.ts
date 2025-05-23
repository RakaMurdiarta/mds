import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { BaseRepository } from '@app/commons/utils/baseRepository';
import { DataSource, EntityManager, FindOneOptions } from 'typeorm';
import { CustomersEntity } from '../customer.entity';
import { CreateCustomerCommand } from '../commands/createCustomer.command';
import { UpdateCustomerCommand } from '../commands/updateCustomer.command';

@Injectable()
export class CustomerRepository extends BaseRepository<CustomersEntity> {
  constructor(private ds: DataSource) {
    super(ds, CustomersEntity);
  }

  async findBy(
    where: FindOneOptions<CustomersEntity>,
  ): Promise<CustomersEntity> {
    return await this.repo.findOne(where);
  }

  async createCustomer(
    cmd: CreateCustomerCommand,
    manager?: EntityManager,
  ): Promise<CustomersEntity> {
    try {
      if (manager) {
        const customer = manager.create(CustomersEntity, {
          name: cmd.name,
          customerId: cmd.customerId,
        });
        const customerSave = await manager.save(customer);

        return customerSave;
      }

      const customer = this.repo.create({
        name: cmd.name,
        customerId: cmd.customerId,
      });

      const customerSave = await this.repo.save(customer);

      return customerSave;
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
  async updateCustomer(
    cmd: UpdateCustomerCommand,
    customer: CustomersEntity,
    manager?: EntityManager,
  ) {
    try {
      Object.keys(cmd).forEach((key) => {
        if (key === 'customerId') {
          return;
        }

        if (cmd[key] !== undefined && cmd[key] !== null) {
          customer[key] = cmd[key];
        }
      });

      if (manager) {
        await manager.save(customer);
        return;
      }

      await this.repo.save(customer);

      return customer;
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
