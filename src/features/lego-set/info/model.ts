import { createGate } from 'effector-react';
import { NavigateFunction } from 'react-router-dom';
import { attach, createEvent, createStore, sample } from 'effector';
import { legoSetService } from '../../../services/LegoSetService.ts';
import { LegoSet } from '../../../types/LegoSetType.ts';

type LegoSetDetail = {
  id: number;
  images?: string[];
  pieces: number;
  name: string;
  number: number;
  series: string;
};

export const gate = createGate<{
  id: string | null;
  navigate: NavigateFunction;
}>();

export const $legoSetDetail = createStore<LegoSetDetail>({
  id: 0,
  images: [],
  name: '',
  number: 0,
  pieces: 0,
  series: '',
});

export const imagesChanged = createEvent();

const GetLegoSetFx = attach({
  source: gate.state.map(({ id }) => id),
  effect: (id) => {
    if (!id) throw new Error('No id provided');
    return legoSetService.GetLegoSet(id);
  },
});

function toDetail(set: LegoSet): LegoSetDetail {
  return {
    id: set.id,
    images: set.images
      ?.sort((current, next) => Number(current.is_main) - Number(next.is_main))
      .map((img) => img.image_url),
    name: set.name,
    number: set.number,
    pieces: set.n_pieces,
    series: set.series.name,
  };
}

sample({
  clock: [gate.open, imagesChanged],
  target: GetLegoSetFx,
});

sample({
  clock: GetLegoSetFx.doneData,
  fn: toDetail,
  target: $legoSetDetail,
});
