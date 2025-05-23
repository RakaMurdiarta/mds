import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { BaseRepository } from '@app/commons/utils/baseRepository';
import { DataSource, EntityManager, FindOneOptions } from 'typeorm';
import { SuppliersEntity } from '../supplier.entity';
import { CreateSupplierCommand } from '../commands/createSupplier.command';
import { UpdateSupplierCommand } from '../commands/updateSupplier.command';

@Injectable()
export class SupplierRepository extends BaseRepository<SuppliersEntity> {
  constructor(private ds: DataSource) {
    super(ds, SuppliersEntity);
  }

  async findBy(
    where: FindOneOptions<SuppliersEntity>,
  ): Promise<SuppliersEntity> {
    return await this.repo.findOne(where);
  }

  async createSupplier(
    cmd: CreateSupplierCommand,
    manager?: EntityManager,
  ): Promise<SuppliersEntity> {
    try {
      if (manager) {
        const supplier = manager.create(SuppliersEntity, {
          name: cmd.name,
          supplierId: cmd.supplierId,
        });
        const supplierSave = await manager.save(supplier);

        return supplierSave;
      }

      const supplier = this.repo.create({
        name: cmd.name,
        supplierId: cmd.supplierId,
      });

      const supplierSave = await this.repo.save(supplier);

      return supplierSave;
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
  async updateSupplier(
    cmd: UpdateSupplierCommand,
    supplier: SuppliersEntity,
    manager?: EntityManager,
  ) {
    try {
      Object.keys(cmd).forEach((key) => {
        if (key === 'supplierId') {
          return;
        }

        if (cmd[key] !== undefined && cmd[key] !== null) {
          supplier[key] = cmd[key];
        }
      });

      if (manager) {
        await manager.save(supplier);
        return;
      }

      await this.repo.save(supplier);

      return supplier;
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
