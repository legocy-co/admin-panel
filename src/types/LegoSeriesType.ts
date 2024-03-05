import { z } from 'zod';
import { Form } from 'effector-forms';

export type LegoSeriesForm = Form<LegoSeriesData>;

export type LegoSeriesData = {
  name: string;
};

export type LegoSeries = z.infer<typeof LegoSeriesSchema>;

export const LegoSeriesSchema = z.object({
  id: z.number(),
  name: z.string(),
});
