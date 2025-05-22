import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dbBaseConfig from './baseConfig';
import { EnvService } from '@env/env.service';
import * as entities from '@entities/index';
import { QueryDbLogger } from '@logger/dbQuery.logger';

export function dbLiveConfig(env: EnvService): TypeOrmModuleOptions {
  const config = {
    ...dbBaseConfig(env),
    type: 'postgres',
    synchronize: false,
    dropSchema: false,
    poolSize: 10,
    entities: Object.values(entities),
    logger: new QueryDbLogger(),
    extra: {
      max: 10,
      connectionTimeoutMillis: 1000,
    },
    connectTimeoutMS: 3000,
  } as TypeOrmModuleOptions;

  return config as TypeOrmModuleOptions;
}
