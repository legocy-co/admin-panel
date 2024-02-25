import {
  attach,
  combine,
  createDomain,
  createEvent,
  Domain,
  sample,
  StoreValue,
} from 'effector';
import { createGate } from 'effector-react';
import { createDisclosure } from '../../../shared/lib/disclosure.ts';
import { createForm } from 'effector-forms';
import { SelectSearchOption } from '../../../shared/ui/select-search.tsx';
import { stringifyParams } from '../../../services/utils.ts';
import { legoSetService } from '../../../services/LegoSetService.ts';
import { debounce, spread } from 'patronum';
import { legoSeriesService } from '../../../services/LegoSeriesService.ts';
import { persist, replaceState } from 'effector-storage/query';

export type LegoSetFilterModel = ReturnType<typeof legoSetFilterFactory>;

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
        init: '',
      },
      max_pieces: {
        init: '',
      },
      series_ids: {
        init: '',
      },
    },
  });

  const filtersApplied = createEvent();
  const cancelTriggered = createEvent();
  const resetTriggered = createEvent();
  const seriesSelected = createEvent<SelectSearchOption>();
  const seriesSearchChanged = createEvent<string>();

  const resetExactFilterTriggered =
    createEvent<keyof StoreValue<typeof form.$values>>();

  const $filtersSnapshot = domain.createStore<StoreValue<
    typeof form.$values
  > | null>(null);

  const $seriesSearch = domain.createStore('');
  const $series = domain.createStore<SelectSearchOption[]>([]);
  const $seriesMap = domain.createStore<Record<string, string>>({});

  const $query = form.$values.map(
    ({ name, min_pieces, max_pieces, series_ids }) =>
      stringifyParams(
        {
          name__ilike: name,
          npieces_gte: min_pieces,
          npieces_lte: max_pieces,
          series_id__in: series_ids,
        },
        false
      )
  );

  const $activeFilters = combine(
    $filtersSnapshot,
    $seriesMap,
    (filters, map) => {
      const allFilters = {
        name: filters?.name,
        min_pieces: filters?.min_pieces,
        max_pieces: filters?.max_pieces,
        series_ids: map[filters?.series_ids ?? ''],
      };

      return Object.entries(allFilters).filter(([, value]) => Boolean(value));
    }
  );

  const fetchSeriesListFx = attach({
    source: $seriesSearch,
    effect: (search) =>
      legoSetService.GetLegoSetsPage(
        stringifyParams(
          {
            name__ilike: search,
            limit: 20,
          },
          false
        )
      ),
  });

  const fetchSeriesFx = attach({
    source: form.$values,
    effect: (values) => {
      if (values.series_ids) {
        return legoSeriesService.GetLegoSeries(values.series_ids);
      }

      return Promise.resolve(null);
    },
  });

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
    target: fetchSeriesFx,
  });

  sample({
    clock: [cancelTriggered, resetTriggered],
    target: disclosure.close,
  });

  sample({
    clock: disclosure.close,
    target: $series.reinit!,
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
    clock: seriesSearchChanged,
    target: $seriesSearch,
  });

  sample({
    clock: debounce({
      source: seriesSearchChanged,
      timeout: 500,
    }),
    target: fetchSeriesListFx,
  });

  sample({
    clock: fetchSeriesListFx.doneData,
    source: $seriesMap,
    fn: (map, response) => ({
      series: response.data.map(
        (series): SelectSearchOption => ({
          label: series.name,
          value: series.id.toString(),
        })
      ),
      map: {
        ...map,
        ...Object.fromEntries(
          response.data.map((series) => [series.id, series.name])
        ),
      },
    }),
    target: spread({
      targets: {
        partners: $series,
        map: $seriesMap,
      },
    }),
  });

  sample({
    clock: seriesSelected,
    target: spread({
      targets: {
        value: form.fields.series_ids.$value,
        label: $seriesSearch,
      },
    }),
  });

  sample({
    clock: disclosure.open,
    source: { map: $seriesMap, values: form.$values },
    fn: ({ map, values }) => map[values.series_ids] ?? '',
    target: $seriesSearch,
  });

  sample({
    clock: fetchSeriesFx.doneData,
    source: $seriesMap,
    fn: (map, response) =>
      response
        ? {
            ...map,
            [response.id]: response.name,
          }
        : map,
    target: $seriesMap,
  });

  sample({
    clock: fetchSeriesFx.doneData,
    source: $series,
    fn: (partners, response) =>
      response
        ? [{ label: response.name, value: response.id.toString() }]
        : partners,
    target: $series,
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

  return {
    form,

    filtersApplied,
    cancelTriggered,
    $query,
    $series: $series,
    $seriesSearch: $seriesSearch,
    seriesSelected: seriesSelected,
    seriesSearchChanged: seriesSearchChanged,

    disclosure,

    gate,

    $activeFilters,

    resetExactFilterTriggered,
    resetTriggered,
  };
};
