import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string(),
  customerId: z.string(),
});

export type CreateCustomerDto = z.infer<typeof createCustomerSchema>;
