import { LegoSetImage } from '../../../types/LegoSetImageType.ts';
import { createGate } from 'effector-react';
import { NavigateFunction } from 'react-router-dom';
import { attach, createEvent, createStore, sample } from 'effector';
import { marketItemService } from '../../../services/MarketItemService.ts';
import { MarketItem } from '../../../types/MarketItemType.ts';

type MarketItemDetail = {
  id: number;
  images?: LegoSetImage[];
  pieces: number;
  name: string;
  number: number;
  series: string;
};

export const gate = createGate<{
  id: string | null;
  navigate: NavigateFunction;
}>();

export const $legoSetDetail = createStore<MarketItemDetail>({
  id: 0,
  images: [],
  name: '',
  number: 0,
  pieces: 0,
  series: '',
});

export const imagesChanged = createEvent();

const GetMarketItemFx = attach({
  source: gate.state.map(({ id }) => id),
  effect: (id) => {
    if (!id) throw new Error('No id provided');
    return marketItemService.GetMarketItem(id);
  },
});

function toDetail(marketItem: MarketItem): MarketItemDetail {
  return {
    id: marketItem.id,
    name: '',
    number: 0,
    pieces: 0,
    series: '',
    //TODO: toDetail & MarketItemDetail
  };
}

sample({
  clock: [gate.open, imagesChanged],
  target: GetMarketItemFx,
});

sample({
  clock: GetMarketItemFx.doneData,
  fn: toDetail,
  target: $legoSetDetail,
});
