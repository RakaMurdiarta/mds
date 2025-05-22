import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as entities from '@entities/index';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.cwd() + `/.env.${process.env.NODE_ENV}` });

export function dbMigrationConfig(): TypeOrmModuleOptions {
  const config = {
    host: process.env['DB_HOST'],
    port: parseInt(process.env['DB_PORT']),
    database: process.env['DB_NAME'],
    username: process.env['DB_USER'],
    password: process.env['DB_PASSWORD'],
    logging: process.env.NODE_ENV !== 'production',
    url: process.env['DB_URL'],
    type: 'postgres',
    synchronize: false,
    dropSchema: false,
    migrations: ['migrations/*.ts'],
    poolSize: 10,
    entities: Object.values(entities),
  } as TypeOrmModuleOptions;

  return config;
}
