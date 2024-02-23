import { createGate } from 'effector-react';
import { NavigateFunction } from 'react-router-dom';
import { Valuation } from '../../../../types/ValuationType.ts';
import { attach, createStore, sample } from 'effector';
import { valuationService } from '../../../../services/ValuationService.ts';

type DetailValuation = {
  valuation: number;
  id: number;
  state: string;
};

export const gate = createGate<{
  id: string | null;
  navigate: NavigateFunction;
}>();

export const $detailValuations = createStore<DetailValuation[]>([]);

const GetValuationsFx = attach({
  source: gate.state.map(({ id }) => id),
  effect: (legoSetID) => {
    if (!legoSetID) throw new Error('No id provided');
    return valuationService.GetLegoSetValuations(legoSetID);
  },
});

function toDetailValuations(valuations: Valuation[]): DetailValuation[] {
  return valuations.map((valuation) => ({
    valuation: valuation.valuation,
    id: valuation.id,
    state: valuation.state,
  }));
}

sample({
  clock: gate.open,
  target: GetValuationsFx,
});

sample({
  clock: GetValuationsFx.doneData,
  fn: toDetailValuations,
  target: $detailValuations,
});
