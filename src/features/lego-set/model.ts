import { NavigateFunction } from 'react-router-dom';
import { createGate } from 'effector-react';
import { createForm } from 'effector-forms';
import { createRule } from '../../services/utils.ts';
import { z } from 'zod';
import {
  attach,
  createDomain,
  createEvent,
  EventPayload,
  sample,
  split,
} from 'effector';
import { LegoSet } from '../../types/LegoSetType.ts';
import { legoSetService } from '../../services/LegoSetService.ts';
import {
  $legoSeriesOptions,
  GetLegoSeriesFx,
  toLegoSeriesOptions,
} from '../lego-series/options/model.ts';

export const gate = createGate<{
  id: string | null;
  navigateFn: NavigateFunction;
}>();

export const form = createForm({
  fields: {
    n_pieces: {
      init: null as unknown as number,
      rules: [
        createRule({
          name: 'n_pieces',
          schema: z
            .number()
            .max(999999)
            .min(1)
            .nonnegative()
            .nullable()
            .refine((value) => value !== null, 'Missing number of pieces'),
        }),
      ],
    },
    name: {
      init: '',
      rules: [
        createRule({
          name: 'name',
          schema: z.string().min(1, 'Missing name'),
        }),
      ],
    },
    number: {
      init: null as unknown as number,
      rules: [
        createRule({
          name: 'number',
          schema: z
            .number()
            .max(999999)
            .nonnegative()
            .nullable()
            .refine((value) => value !== null, 'Missing number'),
        }),
      ],
    },
    series_id: {
      init: '',
      rules: [
        createRule({
          name: 'series_id',
          schema: z.string().min(1, 'Missing Lego series'),
        }),
      ],
    },
  },
});

const domain = createDomain();

export const setForm = domain.createEvent<LegoSet>();

const $setId = gate.state.map(({ id }) => id);

const $isEditing = $setId.map((id) => id !== null);

const setLegoSet = createEvent<LegoSet>();

const fetchLegoSetFx = attach({
  source: $setId,
  effect: (id) => {
    if (!id) throw new Error('ID not provided');
    return legoSetService.GetLegoSet(id);
  },
});

const addLegoSetFx = attach({
  source: form.$values,
  effect: (values) =>
    legoSetService.CreateLegoSet({
      nPieces: values.n_pieces,
      name: values.name,
      number: values.number,
      seriesID: Number(values.series_id),
    }),
});

const updateLegoSetFx = attach({
  source: {
    id: $setId,
    data: form.$values,
  },
  effect: ({ id, data }) =>
    legoSetService.UpdateLegoSet(
      {
        nPieces: data.n_pieces,
        name: data.name,
        number: data.number,
        seriesID: Number(data.series_id),
      },
      id!
    ),
});

const wikiRedirectFx = attach({
  source: gate.state,
  effect: ({ navigateFn }) => navigateFn('/wiki/sets/'),
});

const detailRedirectFx = attach({
  source: [gate.state, $setId],
  effect: ([{ navigateFn }, id]) => navigateFn('/wiki/sets/' + id),
});

function toForm(values: LegoSet): EventPayload<typeof form.setForm> {
  return {
    n_pieces: values.nPieces,
    name: values.name,
    number: values.number,
    series_id: String(values.series.id),
  };
}

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
  clock: $legoSeriesOptions,
  filter: $isEditing,
  target: fetchLegoSetFx,
});

sample({
  clock: fetchLegoSetFx.doneData,
  target: setLegoSet,
});

sample({
  clock: setLegoSet,
  target: setForm,
});

sample({
  clock: setForm,
  fn: toForm,
  target: form.setForm,
});

split({
  source: form.formValidated,
  match: $isEditing.map(String),
  cases: {
    true: updateLegoSetFx,
    false: addLegoSetFx,
  },
});

sample({
  clock: addLegoSetFx.done,
  target: wikiRedirectFx,
});

sample({
  clock: updateLegoSetFx.done,
  target: detailRedirectFx,
});

sample({
  clock: gate.close,
  target: form.reset,
});
