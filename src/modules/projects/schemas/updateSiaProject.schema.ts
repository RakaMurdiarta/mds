import { z } from 'zod';
import { CreateSiaProjectSchema } from './createSiaProject.schema';

/**
 * @description this schema must be the same with column name represented sia database schema
 */

export const UpdateSiaProjectSchema = CreateSiaProjectSchema.omit({
  ProjectID: true,
})
  .partial()
  .merge(z.object({ ProjectID: z.number() }));

export type UpdateSiaProjectDto = z.infer<typeof UpdateSiaProjectSchema>;
