import {
  Domain,
  Effect,
  Store,
  Event,
  createStore,
  createDomain,
  createEvent,
  combine,
  sample,
} from 'effector';
import { spread } from 'patronum';
import { persist } from 'effector-storage/local';

export type PaginationModel = ReturnType<typeof paginationFactory>;

export const paginationFactory = <T, V, K>({
  domain,
  entities,
  mapRequestResult,
  requestFx,
  resetOn,
  key,
}: {
  domain?: Domain;
  entities: Store<T[]>;
  requestFx: Effect<K, V>;
  mapRequestResult: (done: V) => {
    totalCount: number;
  };
  resetOn?: Event<any>;
  key?: string;
}) => {
  const localDomain = domain ?? createDomain();

  const pageSizeChanged = createEvent<number>();
  const pageChanged = createEvent<number>();

  const storesReset = createEvent();
  const $page = localDomain.createStore(0);

  const $pageSize = createStore(10);
  const $totalCount = localDomain.createStore(0);

  const $hasNextPage = combine(
    $page,
    $pageSize,
    $totalCount,
    (page, pageSize, totalCount) => page * pageSize < totalCount
  );

  const $pagesCount = combine($pageSize, $totalCount, (pageSize, totalCount) =>
    Math.ceil(totalCount / pageSize)
  );

  const $paginatedInfo = combine(
    $totalCount,
    $page,
    entities,
    $pageSize,
    (totalCount, page, entities, pageSize) => {
      return `${page * pageSize + 1}-${
        page * pageSize + entities.length
      } of ${totalCount}`;
    }
  );

  sample({
    clock: pageSizeChanged,
    target: [$pageSize, $page.reinit!],
  });

  sample({
    clock: requestFx.doneData,
    fn: mapRequestResult,
    target: spread({
      targets: {
        totalCount: $totalCount,
      },
    }),
  });

  sample({
    clock: pageChanged,
    target: $page,
  });

  sample({
    clock: storesReset,
    target: [$page.reinit!, $totalCount.reinit!],
  });

  if (resetOn) {
    sample({
      clock: resetOn,
      target: [$page.reinit!],
    });
  }

  if (key) {
    persist({
      key: `${key}_page-size`,
      store: $pageSize,
      serialize: (value) => value.toString(),
      deserialize: (value) => Number(value),
    });
  }

  return {
    pageSizeChanged,
    storesReset,
    $page,
    $pageSize,
    $hasNextPage,
    $paginatedInfo,
    $totalCount,
    $pagesCount,
    pageChanged,
  };
};
