import { z } from 'zod';
import { LegoSetSchema } from './LegoSetType.ts';
import objectKeysToZodEnum from '../shared/lib/zod.ts';
import { setStates } from './MarketItemType.ts';

export type ValuationData = {
  lego_set_id: number;
  state: string;
  valuation: number;
};

export type Valuation = z.infer<typeof ValuationSchema>;

export const ValuationSchema = z.object({
  valuation: z.number(),
  id: z.number(),
  lego_set: LegoSetSchema,
  state: objectKeysToZodEnum(setStates),
});
