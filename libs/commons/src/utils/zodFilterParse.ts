import { BadRequestException } from '@nestjs/common';
import { z, ZodError } from 'zod';

export const zodParseSchema = <Schema>(
  schema: z.ZodSchema<Schema>,
  data: any,
) => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors.map((err) => {
        return `field ${err.path[0]}, ${err.message}`;
      });

      const msg = errors[0];

      throw new BadRequestException(msg);
    }

    throw new BadRequestException('Validation Error');
  }
};
