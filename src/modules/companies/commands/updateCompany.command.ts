import { ICommand } from '@nestjs/cqrs';

export class UpdateCompanyCommand implements ICommand {
  constructor(
    public readonly companyId: string,
    public readonly name?: string,
  ) {}
}
