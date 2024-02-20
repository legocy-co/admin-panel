import { SortingState } from '@tanstack/table-core';
import { StoreValue, createEvent, createStore, sample } from 'effector';
import { persist } from 'effector-storage/local';
import { produce } from 'immer';

type Options = {
  columns: {
    id: string;
    title: string;
    size: number;
    hide?: boolean;
  }[];
  key: string;
};

export type ColumnControlModel = ReturnType<typeof createColumnControlModel>;

export const createColumnControlModel = ({ columns, key }: Options) => {
  const visibilityChanged = createEvent<string>();
  const allColumnsVisibilityChanged =
    createEvent<StoreValue<typeof $visibility>>();

  const columnOrderChanged = createEvent<string[]>();
  const columnSizeChanged = createEvent<StoreValue<typeof $columnsSizing>>();

  const columnSortingChanged = createEvent<SortingState>();
  const $titles = createStore(
    Object.fromEntries(columns.map((col) => [col.id, col.title]))
  );

  const $visibility = createStore(
    Object.fromEntries(columns.map((col) => [col.id, true]))
  );

  const $columnOrder = createStore(columns.map((col) => col.id));
  const $columnSorting = createStore<SortingState>([]);

  const $hiddenColumns = createStore(
    Object.fromEntries(columns.map((col) => [col.id, col.hide ?? false]))
  );

  const $columnsSizing = createStore(
    Object.fromEntries(columns.map((column) => [column.id, column.size]))
  );

  sample({
    clock: visibilityChanged,
    source: $visibility,
    fn: (visibles, id) =>
      produce(visibles, (draft) => {
        draft[id] = !draft[id];
      }),
    target: $visibility,
  });

  sample({
    clock: allColumnsVisibilityChanged,
    target: $visibility,
  });

  sample({
    clock: columnOrderChanged,
    target: $columnOrder,
  });

  sample({
    clock: columnSizeChanged,
    target: $columnsSizing,
  });

  sample({
    clock: columnSortingChanged,
    target: $columnSorting,
  });

  persist({
    store: $visibility,
    key: `${key}_column-control-visibility`,
  });

  persist({
    store: $columnOrder,
    key: `${key}_column-control-order`,
  });

  persist({
    store: $columnsSizing,
    key: `${key}_column-control-sizing`,
  });

  persist({
    store: $columnSorting,
    key: `${key}_column-control-sorting`,
  });

  return {
    $titles,
    $columnOrder,
    $visibility,
    $columnsSizing,
    $hiddenColumns,
    $columnSorting,
    visibilityChanged,
    allColumnsVisibilityChanged,
    columnOrderChanged,
    columns,
    columnSizeChanged,
    columnSortingChanged,
  };
};
