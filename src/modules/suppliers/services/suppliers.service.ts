import { Injectable } from '@nestjs/common';
import { EnvService } from '@env/env.service';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { DeleteOutBoxEvent } from '@app/commons/events/deleteOutBoxEvent';
import { zodParseSchema } from '@app/commons/utils/zodFilterParse';
import { SupplierRepository } from '../repositories/suppliers.repository';
import {
  CreateSupplierDto,
  createSupplierSchema,
} from '../schema/createSupplier.schema';
import {
  UpdateSupplierDto,
  updateSupplierSchema,
} from '../schema/updateSupplier.schema';
import { CreateSupplierCommand } from '../commands/createSupplier.command';
import { UpdateSupplierCommand } from '../commands/updateSupplier.command';
import { OuterType } from '@app/commons/utils/externalApi.type';

@Injectable()
export class SupplierServices {
  constructor(
    private envService: EnvService,
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly suppliersRepo: SupplierRepository,
  ) {}

  private async createSupplier(
    args: CreateSupplierDto,
    id: string,
  ): Promise<void> {
    try {
      const supplier = await this.suppliersRepo.findBy({
        where: {
          supplierId: args.supplierId,
        },
      });

      if (supplier) {
        return;
      }

      const cmd = new CreateSupplierCommand(args.supplierId, args.name);
      await this.commandBus.execute(cmd);
      await this.eventBus.publish(new DeleteOutBoxEvent([id]));
    } catch (error) {
      throw error;
    }
  }
  private async updateSupplier(
    args: UpdateSupplierDto,
    id: string,
  ): Promise<void> {
    try {
      const supplier = await this.suppliersRepo.findBy({
        where: {
          supplierId: args.supplierId,
        },
      });

      if (!supplier) {
        return;
      }

      const cmd = new UpdateSupplierCommand(args.supplierId, args.name);
      await this.commandBus.execute(cmd);
      await this.eventBus.publish(new DeleteOutBoxEvent([id]));
    } catch (error) {
      throw error;
    }
  }

  async poolingSuppliers(data: OuterType<unknown>) {
    try {
      switch (data.operation) {
        case 'create': {
          console.log(data.payload);

          const parse = zodParseSchema<CreateSupplierDto>(
            createSupplierSchema,
            data.payload,
          );

          await this.createSupplier(parse, data.id);
          break;
        }

        case 'update': {
          const parse = zodParseSchema<UpdateSupplierDto>(
            updateSupplierSchema,
            data.payload,
          );

          await this.updateSupplier(parse, data.id);
          break;
        }

        default:
          break;
      }
    } catch (error) {
      throw error;
    }
  }
}
