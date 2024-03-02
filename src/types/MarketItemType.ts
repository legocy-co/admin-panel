import { z } from 'zod';
import { LegoSetSchema } from './LegoSetType.ts';
import objectKeysToZodEnum from '../shared/lib/zod.ts';
import { UserSchema } from './UserType.ts';
import { MarketItemImageSchema } from './MarketItemImageType.ts';
import { Form } from 'effector-forms';

export type MarketItem = z.infer<typeof MarketItemSchema>;

export type MarketItemForm = Form<{
  name: string;
  set_state: keyof typeof setStates;
  description: string;
  price: number;
  country: string;
  city: string;
  seller_id: string;
  status: keyof typeof statuses;
}>;

export type MarketItemData = {
  lego_set_id: number;
  set_state: keyof typeof setStates;
  description: string;
  price: number;
  location: string;
  seller_id: number;
  status: keyof typeof statuses;
};

export const setStates = {
  BRAND_NEW: 'Brand New',
  BOX_OPENED: 'Box Opened',
  BAGS_OPENED: 'Bags Opened',
  BUILT_WITH_BOX: 'Built With Box',
  BUILT_WITHOUT_BOX: 'Built Without Box',
  BUILT_PIECES_LOST: 'Built, Pieces Lost',
};

export const statuses = {
  CHECK_REQUIRED: 'Check required',
  ACTIVE: 'Active',
  SOLD: 'Sold',
};

export const MarketItemSchema = z.object({
  id: z.number(),
  price: z.number(),
  location: z.string(),
  lego_set: LegoSetSchema,
  lego_set_id: z.number().optional(),
  seller: UserSchema,
  status: objectKeysToZodEnum(statuses),
  set_state: objectKeysToZodEnum(setStates),
  description: z.string(),
  images: z.array(MarketItemImageSchema),
});
