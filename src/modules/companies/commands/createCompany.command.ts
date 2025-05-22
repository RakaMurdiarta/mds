export class CreateCompanyCommand {
  constructor(
    public companyId: string,
    public name: string,
  ) {}
}
