import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from './env.schema';

@Injectable()
export class EnvService {
  constructor(private cfg: ConfigService<Env, true>) {}

  get<T extends keyof Env>(key: T) {
    return this.cfg.get(key, { infer: true });
  }

  set<T extends keyof Env>(key: T, value: any) {
    return this.cfg.set(key, value);
  }
}
