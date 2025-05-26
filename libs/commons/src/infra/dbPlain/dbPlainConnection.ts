import { Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool, PoolOptions, createPool, PoolConnection } from 'mysql2/promise';
import { MODULE_OPTIONS_TOKEN } from './dbPlain.moduleDefinition';

export abstract class DBPlainConnection
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool;
  constructor(@Inject(MODULE_OPTIONS_TOKEN) private options: PoolOptions) {}

  async onModuleInit() {
    console.info(`[${this.options.database}] >> Initializing MySQL pool...`);

    try {
      this.pool = createPool(this.options);

      await this.checkConnection();

      console.info(
        `[${this.options.database}] >> MySQL connection established successfully.`,
      );
    } catch (error) {
      console.error(
        `[${this.options.database}] >> Failed to connect to MySQL: ${error.message}`,
        {
          props: {
            errors: error,
          },
        },
      );
      throw new Error(
        `[${this.options.database}] >> MySQL connection initialization failed`,
      );
    }
  }

  public async connectionPool(): Promise<PoolConnection> {
    return await this.pool.getConnection();
  }

  private async checkConnection(): Promise<void> {
    try {
      const [rows] = await this.pool.query('SELECT 1');
      if (!rows) {
        throw new Error('Failed to verify connection');
      }
    } catch (error) {
      throw new Error('MySQL connection test failed: ' + error.message);
    }
  }

  async onModuleDestroy() {
    console.info('Closing MySQL pool...');
    await this.pool.end();
  }
}
