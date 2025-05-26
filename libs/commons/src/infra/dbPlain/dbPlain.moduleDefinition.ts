import { ConfigurableModuleBuilder } from '@nestjs/common';
import { PoolOptions } from 'mysql2/promise';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<PoolOptions>().build();
