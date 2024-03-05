import { columns, SeriesRow, toSeriesRows } from './lib.ts';
import { createColumnControlModel } from '../../shared/lib/column-control';
import { createDomain, createEffect, sample } from 'effector';
import { createGate } from 'effector-react';
import { legoSeriesService } from '../../services/LegoSeriesService.ts';
import { deleted } from '../../features/lego-series/delete/model.ts';

export const gate = createGate();

const domain = createDomain();

export const columnControlModel = createColumnControlModel({
  key: 'series',
  columns: columns.map((col) => ({
    id: col.id,
    title: col.title,
    size: col.size,
  })),
});

export const $series = domain.createStore<SeriesRow[]>([]);

const GetLegoSeriesListFx = createEffect(() =>
  legoSeriesService.GetLegoSeriesList()
);

sample({
  clock: gate.open,
  target: GetLegoSeriesListFx,
});

sample({
  clock: GetLegoSeriesListFx.doneData,
  fn: toSeriesRows,
  target: $series,
});

sample({
  clock: deleted,
  source: $series,
  fn: (sets: SeriesRow[], id: number) =>
    sets.filter((ser: SeriesRow) => ser.id !== id),
  target: $series,
});
