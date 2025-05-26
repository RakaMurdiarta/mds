import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string(),
  number: z.string(),
  projectId: z.coerce.number(),
  status: z.string(),
  companyId: z.string(),
  projectType: z.string(),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
