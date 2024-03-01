import { createDisclosure } from '../../../shared/lib/disclosure.ts';
import { createEffect, createEvent, restore, sample } from 'effector';
import { marketItemService } from '../../../services/MarketItemService.ts';

export const disclosure = createDisclosure();

export const deleteTriggered = createEvent<{ id: number; name: string }>();

export const deleteMarketItem = createEvent();
export const deleted = createEvent<number>();

export const $marketItemName = restore(
  deleteTriggered.map((marketItem) => marketItem.name),
  ''
);

const deleteFx = createEffect(marketItemService.DeleteMarketItem);

sample({
  clock: deleteTriggered,
  target: disclosure.open,
});

sample({
  clock: deleteMarketItem,
  source: deleteTriggered,
  fn: ({ id }) => id,
  target: deleteFx,
});

sample({
  clock: deleteFx.done,
  fn: ({ params }) => +params,
  target: [disclosure.close, deleted],
});
