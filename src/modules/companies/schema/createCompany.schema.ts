import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string(),
  companyId: z.string(),
});

export type CreateCompanyDto = z.infer<typeof createCompanySchema>;
