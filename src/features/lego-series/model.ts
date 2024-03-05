import { createGate } from 'effector-react';
import { NavigateFunction } from 'react-router-dom';
import { createForm } from 'effector-forms';
import { createRule } from '../../services/utils.ts';
import { z } from 'zod';
import { attach, EventPayload, sample, split } from 'effector';
import { legoSeriesService } from '../../services/LegoSeriesService.ts';
import { LegoSeries } from '../../types/LegoSeriesType.ts';

export const gate = createGate<{
  id: string | null;
  navigateFn: NavigateFunction;
}>();

export const form = createForm({
  fields: {
    name: {
      init: '',
      rules: [
        createRule({
          name: 'name',
          schema: z.string().min(1, 'Missing name'),
        }),
      ],
    },
  },
});

const $id = gate.state.map(({ id }) => id);

const $isEditing = $id.map((id) => id !== null);

const fetchLegoSeriesFx = attach({
  source: $id,
  effect: (id) => {
    if (!id) throw new Error('ID not provided');
    return legoSeriesService.GetLegoSeries(id);
  },
});

const addLegoSeriesFx = attach({
  source: form.$values,
  effect: (values) =>
    legoSeriesService.CreateLegoSeries({
      name: values.name,
    }),
});

const updateLegoSeriesFx = attach({
  source: {
    id: $id,
    data: form.$values,
  },
  effect: ({ id, data }) =>
    legoSeriesService.UpdateLegoSeries(
      {
        name: data.name,
      },
      id!
    ),
});

const wikiRedirectFx = attach({
  source: gate.state,
  effect: ({ navigateFn }) => navigateFn('/wiki/series/'),
});

function toForm(values: LegoSeries): EventPayload<typeof form.setForm> {
  return {
    name: values.name,
  };
}

sample({
  clock: gate.open,
  target: fetchLegoSeriesFx,
});

sample({
  clock: fetchLegoSeriesFx.doneData,
  fn: toForm,
  target: form.setForm,
});

split({
  source: form.formValidated,
  match: $isEditing.map(String),
  cases: {
    true: updateLegoSeriesFx,
    false: addLegoSeriesFx,
  },
});

sample({
  clock: [addLegoSeriesFx.done, updateLegoSeriesFx.done],
  target: wikiRedirectFx,
});

sample({
  clock: gate.close,
  target: form.reset,
});
