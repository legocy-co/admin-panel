import {
  attach,
  combine,
  createDomain,
  createEffect,
  createEvent,
  Domain,
  Effect,
  sample,
  Store,
  StoreValue,
} from 'effector';
import { createGate } from 'effector-react';
import { createDisclosure } from '../../../shared/lib/disclosure.ts';
import { createForm } from 'effector-forms';
import { stringifyParams } from '../../../services/utils.ts';
import { persist, replaceState } from 'effector-storage/query';
import { legoSeriesService } from '../../../services/LegoSeriesService.ts';
import { SelectSearchOption } from '../../../shared/ui/select-search.tsx';
import { debounce, spread } from 'patronum';

export type LegoSetFilterModel = ReturnType<typeof legoSetFilterFactory>;

export type SearchModel = ReturnType<typeof searchFactory>;

export const legoSetFilterFactory = (options: { domain?: Domain }) => {
  const domain = options.domain ?? createDomain();

  const gate = createGate();

  const disclosure = createDisclosure();

  const form = createForm({
    fields: {
      name: {
        init: '',
      },
      min_pieces: {
        init: null as unknown as number,
      },
      max_pieces: {
        init: null as unknown as number,
      },
      series_ids: {
        init: '',
      },
    },
  });

  const filtersApplied = createEvent();
  const cancelTriggered = createEvent();
  const resetTriggered = createEvent();

  const resetExactFilterTriggered =
    createEvent<keyof StoreValue<typeof form.$values>>();

  const $filtersSnapshot = domain.createStore<StoreValue<
    typeof form.$values
  > | null>(null);

  const fetchSeriesFx = createEffect(({ id }: { id: string }) =>
    legoSeriesService.GetLegoSeries(id)
  );
  const fetchSeriesListFx = createEffect((_: { query: string }) =>
    legoSeriesService.GetLegoSeriesList()
  );

  const seriesListSearch = searchFactory({
    $selected: form.fields.series_ids.$value,
    domain,
    fetchEntityFx: fetchSeriesFx,
    key: 'series_id__in',
    mapEntityToMap: (response) => ({
      [response.id!]: response.name,
    }),
    mapEntityToOption: (response) => ({
      label: response.name,
      value: response.id!.toString(),
    }),
    requestFx: fetchSeriesListFx,
    mapToMap: (response) =>
      Object.fromEntries(response.map((ser) => [ser.id!, ser.name])),
    mapToOptions: (response) =>
      response.map(
        (ser): SelectSearchOption => ({
          label: ser.name,
          value: ser.id!.toString(),
        })
      ),
  });

  const $query = $filtersSnapshot.map((snapshot) =>
    stringifyParams(
      {
        name__ilike: snapshot?.name,
        npieces_gte: snapshot?.min_pieces,
        npieces_lte: snapshot?.max_pieces,
        series_id__in: snapshot?.series_ids,
      },
      false
    )
  );

  const $activeFilters = combine(
    $filtersSnapshot,
    seriesListSearch.$map,
    (filters, seriesListMap) => {
      const allFilters = {
        name: {
          value: filters?.name,
          show: !!filters?.name,
          label: 'Name',
        },
        min_pieces: {
          value: filters?.min_pieces,
          show: !!filters?.min_pieces,
          label: 'Min pieces',
        },
        max_pieces: {
          value: filters?.max_pieces,
          show: !!filters?.max_pieces,
          label: 'Max pieces',
        },
        series_ids: {
          value: filters?.series_ids
            .split(',')
            .map((id) => seriesListMap[id])
            .join(', '),
          show: !!filters?.series_ids,
          label: 'Series',
        },
      };

      return Object.entries(allFilters).filter(([, value]) => Boolean(value));
    }
  );

  sample({
    clock: form.formValidated,
    source: form.$values,
    target: [$filtersSnapshot, disclosure.close, filtersApplied],
  });

  sample({
    clock: gate.open,
    source: form.$values,
    target: $filtersSnapshot,
  });

  sample({
    clock: gate.open,
    target: [seriesListSearch.fetchEntitiesFx],
  });

  sample({
    clock: [cancelTriggered, resetTriggered],
    target: disclosure.close,
  });

  sample({
    clock: cancelTriggered,
    source: $filtersSnapshot,
    filter: Boolean,
    target: form.setForm,
  });

  sample({
    clock: cancelTriggered,
    source: $filtersSnapshot,
    filter: (is) => !is,
    target: form.reset,
  });

  sample({
    clock: resetTriggered,
    target: [form.reset, filtersApplied, $filtersSnapshot.reinit!],
  });

  sample({
    clock: resetExactFilterTriggered,
    source: form.$values,
    fn: (values, field) => ({
      ...values,
      [field]: typeof values[field] === 'string' ? '' : null,
    }),
    target: [form.setForm, filtersApplied, $filtersSnapshot],
  });

  sample({
    clock: gate.close,
    target: [form.reset],
  });

  persist({
    store: form.fields.name.$value,
    key: 'name',
    method: replaceState,
  });

  persist({
    store: form.fields.series_ids.$value,
    key: 'series_ids',
    method: replaceState,
  });

  persist({
    store: form.fields.min_pieces.$value,
    key: 'min_pieces',
    method: replaceState,
  });

  persist({
    store: form.fields.max_pieces.$value,
    key: 'max_pieces',
    method: replaceState,
  });

  return {
    form,

    filtersApplied,
    cancelTriggered,
    $query,

    disclosure,
    seriesListSearch,

    gate,

    $activeFilters,

    resetExactFilterTriggered,
    resetTriggered,
  };
};

function searchFactory<Done, EntityDone>({
  domain,
  mapToOptions,
  mapToMap,
  requestFx,
  key,
  $selected,
  fetchEntityFx,
  mapEntityToMap,
  mapEntityToOption,
}: {
  domain: Domain;
  key: string;
  mapToOptions: (response: Done) => SelectSearchOption[];
  mapToMap: (response: Done) => Record<string, string>;
  requestFx: Effect<
    {
      query: string;
    },
    Done
  >;
  $selected: Store<string>;

  fetchEntityFx: Effect<
    {
      id: string;
    },
    EntityDone
  >;

  mapEntityToOption: (response: EntityDone) => SelectSearchOption;
  mapEntityToMap: (response: EntityDone) => Record<string, string>;
}) {
  const selected = createEvent<SelectSearchOption>();
  const searchChanged = createEvent<string>();
  const removed = createEvent<string>();

  const $search = domain.createStore('');
  const $options = domain.createStore<SelectSearchOption[]>([]);
  const $map = domain.createStore<Record<string, string>>({});
  const $selectedArray = $selected.map((value) =>
    value.split(',').filter(Boolean)
  );

  const $selectedWithNames = combine($selectedArray, $map, (ids, map) =>
    ids.map((id) => ({
      id,
      name: map[id],
    }))
  );

  const $filteredOptions = combine(
    $options,
    $selectedArray,
    (options, selected) => {
      const selectedSet = new Set(selected);
      return options.filter((option) => !selectedSet.has(option.value));
    }
  );

  const searchFx = attach({
    source: $search,
    effect: requestFx,
    mapParams: (_: void, search) => ({
      query: stringifyParams({
        limit: 20,
        [key]: search,
      }),
    }),
  });

  const fetchEntitiesFx = attach({
    source: { map: $map, ids: $selectedArray },
    effect: ({ ids, map }) => {
      if (ids.length > 0) {
        ids.filter((id) => !map[id]).forEach((id) => fetchEntityFx({ id }));
      }
    },
  });

  sample({
    clock: searchChanged,
    target: $search,
  });

  sample({
    clock: debounce({
      source: searchChanged,
      timeout: 500,
    }),
    target: searchFx,
  });

  sample({
    clock: searchFx.doneData,
    source: $map,
    fn: (map, response) => ({
      options: mapToOptions(response),
      map: { ...map, ...mapToMap(response) },
    }),
    target: spread({
      targets: {
        options: $options,
        map: $map,
      },
    }),
  });

  sample({
    clock: selected,
    source: $selectedArray,
    fn: (selected, option) => ({
      label: option.label,
      value: selected.concat(option.value).join(','),
    }),
    target: spread({
      targets: {
        value: $selected,
        label: $search,
      },
    }),
  });

  sample({
    clock: fetchEntityFx.doneData,
    source: $map,
    fn: (map, response) =>
      response
        ? {
            ...map,
            ...mapEntityToMap(response),
          }
        : map,
    target: $map,
  });

  sample({
    clock: fetchEntityFx.doneData,
    source: $options,
    fn: (options, response) =>
      response ? [mapEntityToOption(response)] : options,
    target: $options,
  });

  sample({
    clock: removed,
    source: $selectedArray,
    fn: (selected, value) => selected.filter((id) => id !== value).join(','),
    target: $selected,
  });

  return {
    $filteredOptions,
    searchChanged,
    selected,
    $map,
    $search,
    $options,
    $selectedWithNames,

    fetchEntitiesFx,
    removed,
  };
}
