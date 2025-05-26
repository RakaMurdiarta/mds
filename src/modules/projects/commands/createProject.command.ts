export class CreateProjectCommand {
  constructor(
    public readonly name: string,
    public readonly projectType: string,
    public readonly status: string,
    public readonly companyId: string,
    public readonly number: string,
    public readonly projectId: number,
  ) {}
}
