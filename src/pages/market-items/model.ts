import { createGate } from 'effector-react';
import { attach, createDomain, sample } from 'effector';
import { createColumnControlModel } from '../../shared/lib/column-control';
import { createEffect } from 'effector/compat';
import { Pagination } from '../../shared/lib/pagination';
import { stringifyParams } from '../../services/utils.ts';
import { marketItemService } from '../../services/MarketItemService.ts';
import { columns, MarketItemRow, toMarketItemRows } from './lib.ts';
import { dmi } from '../../features/market-item/delete/index.tsx';

export const gate = createGate();

const domain = createDomain();

export const columnControlModel = createColumnControlModel({
  key: 'market-items',
  columns: columns.map((col) => ({
    id: col.id,
    title: col.title,
    size: col.size,
  })),
});

export const $marketItems = domain.createStore<MarketItemRow[]>([]);

const GetMarketItemsPageBaseFx = createEffect(
  marketItemService.GetMarketItemsPage
);

export const paginationModel = Pagination.factory({
  entities: $marketItems,
  domain,
  requestFx: GetMarketItemsPageBaseFx,
  mapRequestResult: (data) => ({ totalCount: data.meta?.total ?? 0 }),
  key: 'market-items',
});

const GetMarketItemsPageFx = attach({
  source: {
    page: paginationModel.$page,
    pageSize: paginationModel.$pageSize,
  },
  effect: ({ page, pageSize }) =>
    GetMarketItemsPageBaseFx(
      stringifyParams({ limit: pageSize, offset: page * pageSize })
    ),
});

sample({
  clock: [gate.open, paginationModel.$pageSize, paginationModel.$page],
  filter: gate.status,
  target: GetMarketItemsPageFx,
});

sample({
  clock: GetMarketItemsPageFx.doneData,
  fn: toMarketItemRows,
  target: $marketItems,
});

sample({
  clock: dmi.deleted,
  source: $marketItems,
  fn: (marketItems: MarketItemRow[], id: number) =>
    marketItems.filter((item: MarketItemRow) => item.id !== id),
  target: $marketItems,
});
