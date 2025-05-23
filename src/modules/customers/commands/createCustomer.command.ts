export class CreateCustomerCommand {
  constructor(
    public customerId: string,
    public name: string,
  ) {}
}
