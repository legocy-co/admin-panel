import { z } from 'zod';
import { LegoSetImageSchema } from './LegoSetImageType.ts';
import { LegoSeriesSchema } from './LegoSeriesType.ts';
import { Form } from 'effector-forms';

export type LegoSetData = {
  nPieces: number;
  name: string;
  number: number;
  seriesID: number;
};

export type LegoSetForm = Form<{
  n_pieces: number;
  name: string;
  number: number;
  series_id: string;
}>;

export type LegoSet = z.infer<typeof LegoSetSchema>;

export const LegoSetSchema = z.object({
  id: z.number(),
  images: z.array(LegoSetImageSchema).nullable(),
  nPieces: z.number(),
  name: z.string(),
  number: z.number(),
  series: LegoSeriesSchema,
});
