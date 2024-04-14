import { z } from 'zod';
import { LegoSetSchema } from './LegoSetType.ts';
import objectKeysToZodEnum from '../shared/lib/zod.ts';
import { setStates } from './MarketItemType.ts';

export type ValuationData = {
  legoSetID: number;
  state: string;
  valuation: number;
};

export type Valuation = z.infer<typeof ValuationSchema>;

export const ValuationSchema = z.object({
  id: z.number(),
  legoSet: LegoSetSchema,
  state: objectKeysToZodEnum(setStates),
  valuation: z.number(),
});
