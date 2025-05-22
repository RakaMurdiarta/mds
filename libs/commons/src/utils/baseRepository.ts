import { DataSource, EntityManager, Repository } from 'typeorm';

export class BaseRepository<T> {
  private readonly entityManager: EntityManager;
  constructor(
    private dataSource: DataSource,
    private entity: new () => T,
  ) {
    this.entityManager = this.resolveEntityManager();
  }

  private resolveEntityManager(): EntityManager {
    return this.dataSource.manager;
  }

  protected get repo(): Repository<T> {
    return this.entityManager.getRepository(this.entity);
  }
}
