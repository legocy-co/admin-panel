import {
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
import { stringifyParams } from '../../../services/utils.ts';
import { persist, replaceState } from 'effector-storage/query';
import {
  $legoSeriesOptions,
  GetLegoSeriesFx,
  toLegoSeriesOptions,
} from '../../lego-series/options/model.ts';

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

  const $activeFilters = combine($filtersSnapshot, (filters) => {
    const allFilters = {
      name: filters?.name,
      min_pieces: filters?.min_pieces,
      max_pieces: filters?.max_pieces,
      series_ids: filters?.series_ids,
    };

    return Object.entries(allFilters).filter(([, value]) => Boolean(value));
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
    target: GetLegoSeriesFx,
  });

  sample({
    clock: GetLegoSeriesFx.doneData,
    fn: toLegoSeriesOptions,
    target: $legoSeriesOptions,
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

  return {
    form,

    filtersApplied,
    cancelTriggered,
    $query,

    disclosure,

    gate,

    $activeFilters,

    resetExactFilterTriggered,
    resetTriggered,
  };
};
