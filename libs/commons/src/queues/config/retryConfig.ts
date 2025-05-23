import { BackoffOptions } from 'bullmq';

export const RetryConfig: BackoffOptions = {
  type: 'exponential',
  delay: 10000,
};
