import { Injectable } from '@nestjs/common';
import { CompaniesRepository } from '../repositories/companiesRepository';
import { EnvService } from '@env/env.service';
import { fetchApi } from '@app/commons/utils/fetcher';
import { OuterType } from '@app/commons/utils/externalApi.type';
import {
  CreateCompanyDto,
  createCompanySchema,
} from '../schema/createCompany.schema';
import { TYPE_IDENTIFIER } from '@app/commons/types/typeIdentifier.type';
import { CreateCompanyCommand } from '../commands/createCompany.command';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import {
  UpdateCompanyDto,
  updateCompanySchema,
} from '../schema/updateCompany.schema';
import { UpdateCompanyCommand } from '../commands/updateCompany.command';
import { DeleteOutBoxEvent } from '@app/commons/events/deleteOutBoxEvent';
import { zodParseSchema } from '@app/commons/utils/zodFilterParse';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly companiesRepo: CompaniesRepository,
    private envService: EnvService,
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
  ) {}

  private async createCompany(
    args: CreateCompanyDto,
    id: string,
  ): Promise<void> {
    try {
      const company = await this.companiesRepo.findBy({
        where: {
          companyId: args.companyId,
        },
      });

      if (company) {
        return;
      }

      const cmd = new CreateCompanyCommand(args.companyId, args.name);

      await this.commandBus.execute(cmd);
      await this.eventBus.publish(new DeleteOutBoxEvent([id]));
      return;
    } catch (error) {
      throw error;
    }
  }
  private async updateCompany(
    args: UpdateCompanyDto,
    id: string,
  ): Promise<void> {
    try {
      const company = await this.companiesRepo.findBy({
        where: {
          companyId: args.companyId,
        },
      });

      if (!company) {
        return;
      }

      const cmd = new UpdateCompanyCommand(args.companyId, args.name);

      await this.commandBus.execute(cmd);
      await this.eventBus.publish(new DeleteOutBoxEvent([id]));
    } catch (error) {
      throw error;
    }
  }

  async poolingCompanies(args: TYPE_IDENTIFIER) {
    try {
      const companies = await fetchApi<{
        data: Array<OuterType<CreateCompanyDto>>;
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

      if (companies.data.length === 0) {
        return;
      }

      await Promise.all(
        companies.data.map(async (data) => {
          switch (data.operation) {
            case 'create': {
              const parse = zodParseSchema<CreateCompanyDto>(
                createCompanySchema,
                data.payload,
              );

              await this.createCompany(parse, data.id);
              break;
            }

            case 'update': {
              const parse = zodParseSchema<UpdateCompanyDto>(
                updateCompanySchema,
                data.payload,
              );

              await this.updateCompany(parse, data.id);
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
