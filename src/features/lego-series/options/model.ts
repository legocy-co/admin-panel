import { createEffect, createStore } from 'effector';
import { LegoSeriesType } from '../../../types/LegoSeriesType.ts';
import { legoSeriesService } from '../../../services/LegoSeriesService.ts';

type LegoSeriesOption = {
  id: string;
  name: string;
};

export const GetLegoSeriesFx = createEffect(() =>
  legoSeriesService.GetLegoSeriesList()
);

export const $legoSeriesOptions = createStore<LegoSeriesOption[]>([]);

export function toLegoSeriesOptions(legoSer: LegoSeriesType[]): LegoSeriesOption[] {
  return legoSer.map((legoSer) => ({
    id: String(legoSer.id),
    name: legoSer.name,
  }));
}
