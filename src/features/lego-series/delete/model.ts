import { createDisclosure } from '../../../shared/lib/disclosure.ts';
import { createEffect, createEvent, restore, sample } from 'effector';
import { legoSeriesService } from '../../../services/LegoSeriesService.ts';

export const disclosure = createDisclosure();

export const deleteTriggered = createEvent<{ id: number; name: string }>();

export const deleteLegoSeries = createEvent();
export const deleted = createEvent<number>();

export const $legoSeriesName = restore(
  deleteTriggered.map((legoSer) => legoSer.name),
  ''
);

const deleteFx = createEffect(legoSeriesService.DeleteLegoSeries);

sample({
  clock: deleteTriggered,
  target: disclosure.open,
});

sample({
  clock: deleteLegoSeries,
  source: deleteTriggered,
  fn: ({ id }) => id,
  target: deleteFx,
});

sample({
  clock: [deleteFx.done, deleteFx.fail],
  fn: ({ params }) => +params,
  target: [disclosure.close, deleted],
});
