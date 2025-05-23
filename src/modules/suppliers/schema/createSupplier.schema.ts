import { z } from 'zod';

export const createSupplierSchema = z.object({
  name: z.string(),
  supplierId: z.string(),
});

export type CreateSupplierDto = z.infer<typeof createSupplierSchema>;
