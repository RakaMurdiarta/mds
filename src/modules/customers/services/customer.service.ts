import { Injectable } from '@nestjs/common';
import { EnvService } from '@env/env.service';
import { fetchApi } from '@app/commons/utils/fetcher';
import { TYPE_IDENTIFIER } from '@app/commons/types/typeIdentifier.type';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { DeleteOutBoxEvent } from '@app/commons/events/deleteOutBoxEvent';
import { zodParseSchema } from '@app/commons/utils/zodFilterParse';
import { OuterType } from '@app/commons/utils/externalApi.type';
import { CustomerRepository } from '../repositories/customers.repository';
import {
  CreateCustomerDto,
  createCustomerSchema,
} from '../schema/createCustomer.schema';
import {
  UpdateCustomerDto,
  updateCustomerSchema,
} from '../schema/updateCustomer.schema';
import { CreateCustomerCommand } from '../commands/createCustomer.command';
import { UpdateCustomerCommand } from '../commands/updateCustomer.command';

@Injectable()
export class CustomerServices {
  constructor(
    private envService: EnvService,
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly customerRepo: CustomerRepository,
  ) {}

  private async createCustomer(
    args: CreateCustomerDto,
    id: string,
  ): Promise<void> {
    try {
      const customer = await this.customerRepo.findBy({
        where: {
          customerId: args.customerId,
        },
      });

      if (customer) {
        return;
      }

      const cmd = new CreateCustomerCommand(args.customerId, args.name);
      await this.commandBus.execute(cmd);
      await this.eventBus.publish(new DeleteOutBoxEvent([id]));
    } catch (error) {
      throw error;
    }
  }
  private async updateCustomer(
    args: UpdateCustomerDto,
    id: string,
  ): Promise<void> {
    try {
      const customer = await this.customerRepo.findBy({
        where: {
          customerId: args.customerId,
        },
      });

      if (!customer) {
        return;
      }

      const cmd = new UpdateCustomerCommand(args.customerId, args.name);
      await this.commandBus.execute(cmd);
      await this.eventBus.publish(new DeleteOutBoxEvent([id]));
    } catch (error) {
      throw error;
    }
  }

  async poolingCustomers(args: TYPE_IDENTIFIER) {
    try {
      const customers = await fetchApi<{
        data: Array<OuterType<CreateCustomerDto>>;
      }>({
        url: `${this.envService.get('IPMS_BASE_URL')}/api/integration-outbox?limit=${20}&target=${args.toLowerCase()}`,
        method: 'GET',
        config: {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.envService.get('IPMS_KEY')}`,
          },
        },
      });

      if (customers.data.length === 0) {
        return;
      }

      await Promise.all(
        customers.data.map(async (data) => {
          switch (data.operation) {
            case 'create': {
              console.log(data.payload);

              const parse = zodParseSchema<CreateCustomerDto>(
                createCustomerSchema,
                data.payload,
              );

              await this.createCustomer(parse, data.id);
              break;
            }

            case 'update': {
              const parse = zodParseSchema<UpdateCustomerDto>(
                updateCustomerSchema,
                data.payload,
              );

              await this.updateCustomer(parse, data.id);
              break;
            }

            default:
              break;
          }
        }),
      );
    } catch (error) {
      throw error;
    }
  }
}
