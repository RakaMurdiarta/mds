import { DataSource, EntityManager } from 'typeorm';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({
  scope: Scope.REQUEST,
})
export class DbTxService {
  constructor(private readonly dataSource: DataSource) {}
  public withTx = async <T>(
    callback: (transactionalEntityManager: EntityManager) => Promise<T>,
  ) => {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const data = await callback(queryRunner.manager);
      await queryRunner.commitTransaction();
      return data as unknown as T;
    } catch (error: any) {
      //TODO: should be use logger
      console.log('rollbackTransaction is running');
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  };
}
