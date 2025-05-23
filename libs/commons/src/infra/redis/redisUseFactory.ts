import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { EnvService } from '@env/env.service';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

export const RedisUseFactory: FactoryProvider<Redis> = {
  provide: REDIS_CLIENT,
  useFactory: (env: EnvService) => {
    try {
      const redisInstance = new Redis({
        host: env.get('REDIS_HOST'),
        port: +env.get('REDIS_PORT'),
      });

      redisInstance.on('connect', () => {
        console.info('Redis connect Successfully', {
          sourceClass: 'REDIS CLIENT',
        });
      });

      redisInstance.on('error', (e) => {
        console.info('Redis connection failed', {
          error: e,
          sourceClass: 'REDIS CLIENT',
        });

        throw new Error(`Redis connection failed: ${e}`);
      });

      return redisInstance;
    } catch (error) {
      throw error;
    }
  },
  inject: [EnvService],
};
