import { EnvService } from '@env/env.service';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default function dbBaseConfig(env: EnvService): TypeOrmModuleOptions {
  return {
    host: env.get('DB_HOST'),
    port: env.get('DB_PORT'),
    database: env.get('DB_NAME'),
    username: env.get('DB_USER'),
    password: env.get('DB_PASSWORD'),
    logging: process.env.NODE_ENV !== 'production' ? true : false,
    url: env.get('DB_URL'),
  };
}
