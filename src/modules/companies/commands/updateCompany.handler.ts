import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCompanyCommand } from './updateCompany.command';
import { Injectable } from '@nestjs/common';
import { DbTxService } from '@app/commons/dbTransaction/dbTx.service';
import { CompaniesRepository } from '../repositories/companiesRepository';

@CommandHandler(UpdateCompanyCommand)
@Injectable()
export class UpdateCompanyHandler
  implements ICommandHandler<UpdateCompanyCommand>
{
  constructor(
    private __tx: DbTxService,
    private companiesRepo: CompaniesRepository,
  ) {}
  async execute(command: UpdateCompanyCommand): Promise<any> {
    try {
      const company = await this.companiesRepo.findBy({
        where: {
          companyId: command.companyId,
        },
      });

      if (!company) {
        return;
      }

      await this.__tx.withTx(async (manager) => {
        return await this.companiesRepo.updateCompany(
          command,
          company,
          manager,
        );
      });
    } catch (error) {
      throw error;
    }
  }
}
