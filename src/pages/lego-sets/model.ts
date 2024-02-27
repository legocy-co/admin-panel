import { createGate } from 'effector-react';
import { attach, combine, createDomain, sample } from 'effector';
import { createColumnControlModel } from '../../shared/lib/column-control';
import { columns, SetRow, toSetRows } from './lib.ts';
import { createEffect } from 'effector/compat';
import { legoSetService } from '../../services/LegoSetService.ts';
import { Pagination } from '../../shared/lib/pagination';
import { stringifyParams } from '../../services/utils.ts';
import { deleted } from '../../features/lego-set/delete/model.ts';
import { LegoSetsFilter } from '../../features/lego-set/filter';

export const gate = createGate();

const domain = createDomain();

export const columnControlModel = createColumnControlModel({
  key: 'sets',
  columns: columns.map((col) => ({
    id: col.id,
    title: col.title,
    size: col.size,
  })),
});

export const $sets = domain.createStore<SetRow[]>([]);

export const $selectedLegoSets = domain.createStore<number[]>([]);

export const $allSelected = combine(
  $sets,
  $selectedLegoSets,
  (sets, selected) => sets.length === selected.length
);

const GetLegoSetsPageBaseFx = createEffect(legoSetService.GetLegoSetsPage);

export const legoSetsFilterModel = LegoSetsFilter.factory({
  domain,
});

export const legoSetToggled = domain.createEvent<number>();

export const toggleAll = domain.createEvent();

export const paginationModel = Pagination.factory({
  entities: $sets,
  domain,
  requestFx: GetLegoSetsPageBaseFx,
  mapRequestResult: (data) => ({ totalCount: data.meta?.total ?? 0 }),
  key: 'sets',
});

const GetLegoSetsPageFx = attach({
  source: {
    page: paginationModel.$page,
    pageSize: paginationModel.$pageSize,
    query: legoSetsFilterModel.$query,
  },
  effect: ({ page, pageSize, query }) =>
    GetLegoSetsPageBaseFx(
      stringifyParams(
        { limit: pageSize, offset: page * pageSize },
        true,
        query.split('%2C').join('&series_id__in=')
      )
    ),
});

sample({
  clock: [
    gate.open,
    paginationModel.$pageSize,
    paginationModel.$page,
    legoSetsFilterModel.filtersApplied,
  ],
  filter: gate.status,
  target: GetLegoSetsPageFx,
});

sample({
  clock: legoSetToggled,
  source: $selectedLegoSets,
  fn: (selected, id) =>
    selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id],
  target: $selectedLegoSets,
});

sample({
  clock: GetLegoSetsPageFx.doneData,
  fn: toSetRows,
  target: $sets,
});

sample({
  clock: toggleAll,
  source: { allSelected: $allSelected, sets: $sets },
  fn: ({ allSelected, sets }) =>
    allSelected ? [] : sets.map((set: SetRow) => set.id),
  target: $selectedLegoSets,
});

sample({
  clock: deleted,
  source: $sets,
  fn: (sets: SetRow[], id: number) =>
    sets.filter((set: SetRow) => set.id !== id),
  target: $sets,
});
