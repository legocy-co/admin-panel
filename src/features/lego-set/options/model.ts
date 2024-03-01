import { createEffect, createStore } from 'effector';
import { LegoSet } from '../../../types/LegoSetType.ts';
import { legoSetService } from '../../../services/LegoSetService.ts';

type LegoSetOption = {
  id: string;
  number: number;
  name: string;
};

export const GetLegoSetsFx = createEffect(() => legoSetService.GetLegoSets());

export const $legoSetOptions = createStore<LegoSetOption[]>([]);

export function toOptions(legoSets: LegoSet[]): LegoSetOption[] {
  return legoSets.map((legoSet) => ({
    id: String(legoSet.id),
    number: legoSet.number,
    name: legoSet.name,
  }));
}
