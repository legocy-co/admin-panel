import { z } from 'zod';

export type LegoSetImage = z.infer<typeof LegoSetImageSchema>;

export const LegoSetImageSchema = z.object({
  id: z.number(),
  image_url: z.string(),
  is_main: z.boolean(),
  lego_set_id: z.number(),
});
