export class UpdateProjectCommand {
  constructor(
    public readonly projectId: number,
    public readonly name?: string,
    public readonly projectType?: string,
    public readonly status?: string,
    public readonly companyId?: string,
    public readonly number?: string,
  ) {}
}
