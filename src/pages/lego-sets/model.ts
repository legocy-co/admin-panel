import { createGate } from 'effector-react';
import { attach, createDomain, sample } from 'effector';
import { createColumnControlModel } from '../../shared/lib/column-control';
import { columns, SetRow, toSetRows } from './lib.ts';
import { createEffect } from 'effector/compat';
import { legoSetService } from '../../services/LegoSetService.ts';
import { Pagination } from '../../shared/lib/pagination';
import { stringifyParams } from '../../services/utils.ts';
import { deleted } from '../../features/lego-set/delete/model.ts';

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

const GetLegoSetsPageBaseFx = createEffect(legoSetService.GetLegoSetsPage);

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
  },
  effect: ({ page, pageSize }) =>
    GetLegoSetsPageBaseFx(
      stringifyParams({ limit: pageSize, offset: page * pageSize }, true)
    ),
});

sample({
  clock: [gate.open, paginationModel.$pageSize, paginationModel.$page, deleted],
  filter: gate.status,
  target: GetLegoSetsPageFx,
});

sample({
  clock: GetLegoSetsPageFx.doneData,
  fn: toSetRows,
  target: $sets,
});
