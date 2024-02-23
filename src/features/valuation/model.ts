import { createGate } from 'effector-react';
import { createForm } from 'effector-forms';
import { createRule } from '../../services/utils.ts';
import { z } from 'zod';
import { attach, sample } from 'effector';
import { valuationService } from '../../services/ValuationService.ts';

export const gate = createGate<{
  state: string;
  lego_set_id: string | null;
}>();

export const form = createForm({
  fields: {
    valuation: {
      init: null as unknown as number,
      rules: [
        createRule({
          name: 'valuation',
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
  },
});

const $state = gate.state.map((state) => state.state);

const $legoSetId = gate.state.map((state) => state.lego_set_id);

const addValuationFx = attach({
  source: [form.$values, $state, $legoSetId],
  effect: ([values, state, legoSetId]) =>
    valuationService.CreateValuation({
      valuation: values.valuation,
      lego_set_id: Number(legoSetId),
      state: state,
    }),
});

sample({
  source: form.formValidated,
  target: addValuationFx,
});

sample({
  clock: gate.close,
  target: form.reset,
});
