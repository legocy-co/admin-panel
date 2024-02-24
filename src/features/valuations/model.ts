import { createGate } from 'effector-react';
import { NavigateFunction } from 'react-router-dom';
import { Valuation } from '../../types/ValuationType.ts';
import { attach, createStore, EventPayload, sample } from 'effector';
import { valuationService } from '../../services/ValuationService.ts';
import { createForm } from 'effector-forms';
import { createRule } from '../../services/utils.ts';
import { z } from 'zod';
import { setStates } from '../../types/MarketItemType.ts';

type StateValuation = {
  valuation: number;
  id: number;
  state: string;
};

export const gate = createGate<{
  id: string | null;
  navigate: NavigateFunction;
}>();

export const form = createForm({
  fields: {
    BRAND_NEW: {
      init: null as unknown as number,
      rules: [
        createRule({
          name: 'BRAND_NEW',
          schema: z.number().max(999999).min(1).nonnegative().nullable(),
        }),
      ],
    },
    BOX_OPENED: {
      init: null as unknown as number,
      rules: [
        createRule({
          name: 'BOX_OPENED',
          schema: z.number().max(999999).min(1).nonnegative().nullable(),
        }),
      ],
    },
    BAGS_OPENED: {
      init: null as unknown as number,
      rules: [
        createRule({
          name: 'BAGS_OPENED',
          schema: z.number().max(999999).min(1).nonnegative().nullable(),
        }),
      ],
    },
    BUILT_WITH_BOX: {
      init: null as unknown as number,
      rules: [
        createRule({
          name: 'BUILT_WITH_BOX',
          schema: z.number().max(999999).min(1).nonnegative().nullable(),
        }),
      ],
    },
    BUILT_WITHOUT_BOX: {
      init: null as unknown as number,
      rules: [
        createRule({
          name: 'BUILT_WITHOUT_BOX',
          schema: z.number().max(999999).min(1).nonnegative().nullable(),
        }),
      ],
    },
    BUILT_PIECES_LOST: {
      init: null as unknown as number,
      rules: [
        createRule({
          name: 'BUILT_PIECES_LOST',
          schema: z.number().max(999999).min(1).nonnegative().nullable(),
        }),
      ],
    },
  },
});

export const $detailValuations = createStore<StateValuation[]>([]);

const $legoSetId = gate.state.map(({ id }) => id);

const GetValuationsFx = attach({
  source: $legoSetId,
  effect: (legoSetID) => {
    if (!legoSetID) throw new Error('No id provided');
    return valuationService.GetLegoSetValuations(legoSetID);
  },
});

const pushValuationsFx = attach({
  source: [form.$values, $detailValuations, $legoSetId],
  effect: async ([values, initial, legoSetId]) => {
    const states = Object.keys(setStates);
    for (let i = 0; i < states.length; i++) {
      const initialValuation =
        initial.find((value: StateValuation) => value.state === states[i]) ??
        null;
      switch (Object.values(values)[i]) {
        case null:
          if (!initialValuation) break;
          await valuationService.DeleteValuation(initialValuation.id);
          break;
        case initialValuation && initialValuation!.valuation:
          break;
        default:
          if (!initialValuation) {
            await valuationService.CreateValuation({
              valuation: Object.values(values)[i],
              state: Object.keys(values)[i],
              lego_set_id: Number(legoSetId),
            });
          } else {
            console.log(initialValuation);
            await valuationService.UpdateValuation(
              {
                valuation: Object.values(values)[i],
                state: Object.keys(values)[i],
                lego_set_id: Number(legoSetId),
              },
              initialValuation.id
            );
          }
      }
    }
  },
});

function toStateValuations(valuations: Valuation[]): StateValuation[] {
  return valuations.map((valuation) => ({
    valuation: valuation.valuation,
    id: valuation.id,
    state: valuation.state,
  }));
}

function toForm(values: Valuation[]): EventPayload<typeof form.setForm> {
  return {
    BRAND_NEW: values.find((value) => value.state === 'BRAND_NEW')?.valuation,
    BOX_OPENED: values.find((value) => value.state === 'BOX_OPENED')?.valuation,
    BAGS_OPENED: values.find((value) => value.state === 'BAGS_OPENED')
      ?.valuation,
    BUILT_WITH_BOX: values.find((value) => value.state === 'BUILT_WITH_BOX')
      ?.valuation,
    BUILT_WITHOUT_BOX: values.find(
      (value) => value.state === 'BUILT_WITHOUT_BOX'
    )?.valuation,
    BUILT_PIECES_LOST: values.find(
      (value) => value.state === 'BUILT_PIECES_LOST'
    )?.valuation,
  };
}

sample({
  clock: gate.open,
  target: GetValuationsFx,
});

sample({
  clock: GetValuationsFx.doneData,
  fn: toStateValuations,
  target: $detailValuations,
});

sample({
  clock: GetValuationsFx.doneData,
  fn: toForm,
  target: form.setForm,
});

sample({
  source: form.formValidated,
  target: pushValuationsFx,
});

sample({
  clock: pushValuationsFx.done,
  target: GetValuationsFx,
});

sample({
  clock: gate.close,
  target: form.reset,
});
