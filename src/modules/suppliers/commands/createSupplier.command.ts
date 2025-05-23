export class CreateSupplierCommand {
  constructor(
    public supplierId: string,
    public name: string,
  ) {}
}
