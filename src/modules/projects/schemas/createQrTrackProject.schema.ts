import { z } from 'zod';

/**
 * @description this schema must be the same with column name represented qr track database schema
 */
export const CreateQrTrackProjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  sector_type: z.string(),
});

export type CreateQrTrackProjectDto = z.infer<
  typeof CreateQrTrackProjectSchema
>;
