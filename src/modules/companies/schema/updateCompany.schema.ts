import { z } from 'zod';
import { createCompanySchema } from './createCompany.schema';

export const updateCompanySchema = createCompanySchema
  .omit({ companyId: true })
  .partial()
  .merge(
    z.object({
      companyId: z.string(),
    }),
  );

export type UpdateCompanyDto = z.infer<typeof updateCompanySchema>;
