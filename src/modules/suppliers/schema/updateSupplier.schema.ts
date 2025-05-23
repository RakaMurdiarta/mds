import { z } from 'zod';
import { createSupplierSchema } from './createSupplier.schema';

export const updateSupplierSchema = createSupplierSchema
  .omit({ supplierId: true })
  .partial()
  .merge(
    z.object({
      supplierId: z.string(),
    }),
  );

export type UpdateSupplierDto = z.infer<typeof updateSupplierSchema>;
