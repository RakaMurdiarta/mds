import { z } from 'zod';
import { LogLevel } from '@logger/logger.type';

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(8080),
  HOST: z.string().optional().default('0.0.0.0'),
  LOG_LEVEL: z
    .string()
    .transform((val) => {
      const validLevels: LogLevel[] = ['error', 'debug', 'info', 'warn'];

      const trimmedVal = val.trim().toLowerCase() as LogLevel;

      if (!validLevels.includes(trimmedVal)) {
        throw new Error(
          `LOG_LEVEL must be one of the following: ${validLevels.join(', ')}`,
        );
      }
      return trimmedVal;
    })
    .refine((val) => ['error', 'debug', 'info', 'warn'].includes(val), {
      message:
        'LOG_LEVEL must be one of the following: error, debug, info, warn',
    }),
  APP: z.string().optional().default('CORE GATEWAY'),
  CONTEXT: z.string().optional().default('logger Ctx'),
  ORGANIZATION: z.string().optional().default('IPMS CORE GATEWAY'),
  slackWebhookUrl: z.string().optional().default('url'),
  //Database
  DB_NAME: z.string().optional().default('local'),
  DB_USER: z.string().optional().default('admin'),
  DB_PORT: z.coerce.number().optional().default(5432),
  DB_PASSWORD: z.string().optional().default('admin'),
  DB_HOST: z.string().optional().default('127.0.0.1'),
  DB_URL: z.string().optional(),
  //Database External App -- SIA
  DB_SIA_USER: z.string(),
  DB_SIA_HOST: z.string(),
  DB_SIA_PWD: z.string(),
  DB_SIA_NAME: z.string(),
  DB_SIA_PORT: z.coerce.number(),
  //Database External App -- QR TRACK
  DB_QR_TRACK_USER: z.string(),
  DB_QR_TRACK_HOST: z.string(),
  DB_QR_TRACK_PWD: z.string(),
  DB_QR_TRACK_NAME: z.string(),
  DB_QR_TRACK_PORT: z.coerce.number(),

  //REDIS
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_HOST: z.string().optional().default('127.0.0.1'),

  //IPMS
  IPMS_KEY: z.string(),
  IPMS_BASE_URL: z.string(),
});

export type Env = z.infer<typeof envSchema>;
