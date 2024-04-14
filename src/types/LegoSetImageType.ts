import { z } from 'zod';

export type LegoSetImage = z.infer<typeof LegoSetImageSchema>;

export const LegoSetImageSchema = z.object({
  id: z.number(),
  imageURL: z.string(),
  isMain: z.boolean(),
  legoSetID: z.number(),
});
