import { DynamicModule, Module } from '@nestjs/common';
import {
  ConfigurableModuleClass,
  OPTIONS_TYPE,
} from './bullmq.moduleDefinition';
import { BullModule } from '@nestjs/bullmq';

@Module({})
export class BullMqQueue extends ConfigurableModuleClass {
  static register(op: typeof OPTIONS_TYPE): DynamicModule {
    // const bullBoardModules = op.queues.map((name) =>
    //   BullBoardModule.forFeature({
    //     name,
    //     adapter: BullMQAdapter,
    //   }),
    // );
    const bullModules = op.queues.map((name) =>
      BullModule.registerQueue({ name }),
    );

    return {
      ...super.register(op),
      imports: [...bullModules],
      exports: [...bullModules],
    };
  }
}
