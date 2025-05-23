import { Module } from '@nestjs/common';
import { EnvModule } from '@env/env.module';
import { REDIS_CLIENT, RedisUseFactory } from './redisUseFactory';

@Module({
  imports: [EnvModule],
  providers: [RedisUseFactory],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
