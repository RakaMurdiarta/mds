import { z } from 'zod';
import { CreateQrTrackProjectSchema } from './createQrTrackProject.schema';

/**
 * @description this schema must be the same with column name represented sia database schema
 */

export const UpdateQrTrackProjectSchema = CreateQrTrackProjectSchema.omit({
  id: true,
})
  .partial()
  .merge(z.object({ id: z.number() }));

export type UpdateQrTrackProjectDto = z.infer<
  typeof UpdateQrTrackProjectSchema
>;
