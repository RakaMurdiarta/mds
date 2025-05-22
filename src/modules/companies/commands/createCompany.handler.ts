import { ConflictException, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCompanyCommand } from './createCompany.command';
import { DbTxService } from '@app/commons/dbTransaction/dbTx.service';
import { CompaniesRepository } from '../repositories/companiesRepository';

@CommandHandler(CreateCompanyCommand)
@Injectable()
export class CreateCompanyHandler
  implements ICommandHandler<CreateCompanyCommand>
{
  constructor(
    private __tx: DbTxService,
    private companiesRepo: CompaniesRepository,
  ) {}
  async execute(command: CreateCompanyCommand): Promise<any> {
    try {
      await this.__tx.withTx(async (manager) => {
        const company = await this.companiesRepo.findBy({
          where: {
            companyId: command.companyId,
          },
        });

        if (company) {
          throw new ConflictException('company already exist');
        }

        return await this.companiesRepo.createCompany(command, manager);
      });
    } catch (error) {
      throw error;
    }
  }
}
