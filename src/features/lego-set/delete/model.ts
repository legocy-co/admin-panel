import { createDisclosure } from '../../../shared/lib/disclosure.ts';
import { createEffect, createEvent, restore, sample } from 'effector';
import { legoSetService } from '../../../services/LegoSetService.ts';

export const disclosure = createDisclosure();

export const deleteTriggered = createEvent<{ id: number; name: string }>();

export const deleteLegoSet = createEvent();
export const deleted = createEvent<number>();

export const $legoSetName = restore(
  deleteTriggered.map((legoSet) => legoSet.name),
  ''
);

const deleteFx = createEffect(legoSetService.DeleteLegoSet);

sample({
  clock: deleteTriggered,
  target: disclosure.open,
});

sample({
  clock: deleteLegoSet,
  source: deleteTriggered,
  fn: ({ id }) => id,
  target: deleteFx,
});

sample({
  clock: deleteFx.done,
  fn: ({ params }) => +params,
  target: [disclosure.close, deleted],
});
