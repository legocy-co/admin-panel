import { z } from 'zod';

export type MarketItemImage = z.infer<typeof MarketItemImageSchema>;

export const MarketItemImageSchema = z.object({
  id: z.number(),
  image_url: z.string(),
  is_main: z.boolean(),
});
