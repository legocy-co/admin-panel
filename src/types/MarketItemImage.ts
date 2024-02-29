import { z } from 'zod';

export const MarketItemImageSchema = z.object({
  id: z.number(),
  image_url: z.string(),
  is_main: z.boolean(),
});
