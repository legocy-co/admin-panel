import { z } from 'zod';

export const LegoSeriesSchema = z.object({
  id: z.number(),
  name: z.string(),
});
