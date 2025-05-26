import { DynamicModule, Module } from '@nestjs/common';
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './dbPlain.moduleDefinition';
import { EnvModule } from '@env/env.module';

export const DBPOOL = Symbol('DBPOOL');

@Module({
  imports: [EnvModule],
  //   exports: [MODULE_OPTIONS_TOKEN],
})
export class DatabasePlainModule extends ConfigurableModuleClass {
  static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return {
      module: DatabasePlainModule,
      imports: options.imports || [],
      providers: [
        {
          provide: MODULE_OPTIONS_TOKEN,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ],
      exports: [MODULE_OPTIONS_TOKEN],
    };
  }
}
