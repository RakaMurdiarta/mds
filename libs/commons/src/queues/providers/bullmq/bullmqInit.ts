import { BullModule } from '@nestjs/bullmq';
import { EnvService } from '@env/env.service';
import { QueueOptions } from 'bullmq';
import { EnvModule } from '@env/env.module';

export const BullMQInit = BullModule.forRootAsync({
  imports: [EnvModule],
  useFactory: (env: EnvService) => {
    try {
      const connection: QueueOptions = {
        connection: {
          host: env.get('REDIS_HOST'),
          port: env.get('REDIS_PORT'),
        },
        defaultJobOptions: {
          removeOnComplete: 1000,
          removeOnFail: 5000,
          attempts: 3,
        },
      };
      return connection;
    } catch (error) {
      console.error('failed to connect redis on redis-bullmq configuration');
      throw error;
    }
  },
  inject: [EnvService],
});
