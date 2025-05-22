import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { BaseRepository } from '@app/commons/utils/baseRepository';
import { CompaniesEntity } from '../companies.entity';
import { DataSource, EntityManager, FindOneOptions } from 'typeorm';
import { CreateCompanyCommand } from '../commands/createCompany.command';
import { UpdateCompanyCommand } from '../commands/updateCompany.command';

@Injectable()
export class CompaniesRepository extends BaseRepository<CompaniesEntity> {
  constructor(private ds: DataSource) {
    super(ds, CompaniesEntity);
  }

  async findBy(
    where: FindOneOptions<CompaniesEntity>,
  ): Promise<CompaniesEntity> {
    return await this.repo.findOne(where);
  }

  async createCompany(
    cmd: CreateCompanyCommand,
    manager?: EntityManager,
  ): Promise<CompaniesEntity> {
    try {
      if (manager) {
        const company = manager.create(CompaniesEntity, {
          name: cmd.name,
          companyId: cmd.companyId,
        });
        const companySave = await manager.save(company);

        return companySave;
      }

      const company = this.repo.create({
        name: cmd.name,
        companyId: cmd.companyId,
      });

      const companySave = await this.repo.save(company);

      return companySave;
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
  async updateCompany(
    cmd: UpdateCompanyCommand,
    company: CompaniesEntity,
    manager?: EntityManager,
  ) {
    try {
      Object.keys(cmd).forEach((key) => {
        if (key === 'companyId') {
          return;
        }

        if (cmd[key] !== undefined && cmd[key] !== null) {
          company[key] = cmd[key];
        }
      });

      if (manager) {
        await manager.save(company);
        return;
      }

      await this.repo.save(company);

      return company;
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
