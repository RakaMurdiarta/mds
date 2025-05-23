import { ConfigurableModuleBuilder } from '@nestjs/common';
import { IRedisBullQueue } from './bullmq.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<IRedisBullQueue>().build();
