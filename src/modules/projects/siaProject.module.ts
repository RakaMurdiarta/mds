import { Module } from '@nestjs/common';
import { DatabasePlainModule } from '@app/commons/infra/dbPlain/dbPlain.module';
import { EnvService } from '@env/env.service';
import { SiaRepo } from './repositories/siaRepository';

@Module({
  imports: [
    DatabasePlainModule.registerAsync({
      useFactory: (env: EnvService) => {
        return {
          host: env.get('DB_SIA_HOST'),
          user: env.get('DB_SIA_USER'),
          password: env.get('DB_SIA_PWD'),
          database: env.get('DB_SIA_NAME'),
          waitForConnections: true,
          connectionLimit: 50,
          queueLimit: 100,
          port: env.get('DB_SIA_PORT'),
        };
      },
      inject: [EnvService],
    }),
  ],
  providers: [SiaRepo],
  exports: [SiaRepo],
})
export class SiaModule {}
