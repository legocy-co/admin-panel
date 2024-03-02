import { createGate } from 'effector-react';
import { NavigateFunction } from 'react-router-dom';
import { attach, createEvent, createStore, sample } from 'effector';
import { marketItemService } from '../../../services/MarketItemService.ts';
import {
  MarketItem,
  setStates,
  statuses,
} from '../../../types/MarketItemType.ts';
import { MarketItemImage } from '../../../types/MarketItemImageType.ts';

type MarketItemDetail = {
  id: number;
  seller: string;
  status: string;
  description: string;
  lego_set: string;
  location: string;
  price: number;
  set_state: string;
  images: MarketItemImage[];
};

export const gate = createGate<{
  id: string | null;
  navigate: NavigateFunction;
}>();

export const $marketItemDetail = createStore<MarketItemDetail>({
  id: 0,
  description: '',
  lego_set: '',
  location: '',
  price: 0,
  seller: '',
  set_state: '',
  status: '',
  images: [],
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
    description: marketItem.description,
    lego_set: marketItem.lego_set.name,
    location: marketItem.location,
    price: marketItem.price,
    seller: marketItem.seller.username,
    set_state: setStates[marketItem.set_state],
    status: statuses[marketItem.status],
    images: marketItem.images,
  };
}

sample({
  clock: [gate.open, imagesChanged],
  target: GetMarketItemFx,
});

sample({
  clock: GetMarketItemFx.doneData,
  fn: toDetail,
  target: $marketItemDetail,
});