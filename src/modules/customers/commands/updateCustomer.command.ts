import { ICommand } from '@nestjs/cqrs';

export class UpdateCustomerCommand implements ICommand {
  constructor(
    public readonly customerId: string,
    public readonly name?: string,
  ) {}
}
