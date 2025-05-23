import { z } from 'zod';
import { createCustomerSchema } from './createCustomer.schema';

export const updateCustomerSchema = createCustomerSchema
  .omit({ customerId: true })
  .partial()
  .merge(
    z.object({
      customerId: z.string(),
    }),
  );

export type UpdateCustomerDto = z.infer<typeof updateCustomerSchema>;
