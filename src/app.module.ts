import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from '@env/env.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvModule } from '@env/env.module';
import { EnvService } from '@env/env.service';
import { DataSource } from 'typeorm';
import { dbLiveConfig } from '@app/commons/config/db/liveConfig';
import { CompaniesModule } from './modules/companies/companies.module';
import { ResponseApiInterceptor } from '@app/commons/api/responseApi.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ExOutBoxModule } from '@app/commons/external/exOutBox.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { CustomersModule } from './modules/customers/customers.module';
import { BullMQInit } from '@app/commons/queues/providers/bullmq/bullmqInit';
import { RedisModule } from '../libs/commons/src/infra/redis/redis.mdule';
import { ProjectsModule } from './modules/projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (env: EnvService) => {
        return {
          ...dbLiveConfig(env),
        };
      },
      dataSourceFactory: async (options) => {
        const logger = new Logger('Database Connection');
        try {
          const dataSource = await new DataSource(options).initialize();
          logger.log('Database Successfully Connected 🚀');
          return dataSource;
        } catch (error) {
          logger.error('Database Failed To Connect');
          throw error;
        }
      },
      imports: [EnvModule],
      inject: [EnvService],
    }),
    CqrsModule,
    CompaniesModule,
    ExOutBoxModule,
    SuppliersModule,
    CustomersModule,
    RedisModule,
    BullMQInit,
    ProjectsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseApiInterceptor,
    },
  ],
})
export class AppModule {}
