import { z } from 'zod';

export type LegoSeriesType = z.infer<typeof LegoSeriesSchema>;

export const LegoSeriesSchema = z.object({
  id: z.number(),
  name: z.string(),
});
