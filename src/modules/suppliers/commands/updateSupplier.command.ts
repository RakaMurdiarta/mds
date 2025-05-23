import { ICommand } from '@nestjs/cqrs';

export class UpdateSupplierCommand implements ICommand {
  constructor(
    public readonly supplierId: string,
    public readonly name?: string,
  ) {}
}
