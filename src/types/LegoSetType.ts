import { z } from 'zod';
import { LegoSetImageSchema } from './LegoSetImage.ts';
import { LegoSeriesSchema } from './LegoSeries.ts';

export type LegoSet = z.infer<typeof LegoSetSchema>;

export const LegoSetSchema = z.object({
  id: z.number(),
  images: z.array(LegoSetImageSchema).nullable(),
  name: z.string(),
  number: z.number(),
  n_pieces: z.number(),
  series: LegoSeriesSchema,
});
