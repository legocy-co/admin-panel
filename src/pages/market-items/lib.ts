import { PaginationData } from '../../types/pagination.ts';
import { MarketItem, setStates } from '../../types/MarketItemType.ts';

export type MarketItemRow = {
  id: number;
  price: string;
  location: string;
  lego_set_name: string;
  seller_username: string;
  status?: string;
  set_state: string;
};

export const columns = [
  {
    id: 'price',
    size: 200,
    title: 'Price',
  },
  {
    id: 'location',
    size: 400,
    title: 'Location',
  },
  {
    id: 'lego_set_name',
    size: 400,
    title: 'Set',
  },
  {
    id: 'seller_username',
    size: 200,
    title: 'Seller',
  },
  {
    id: 'status',
    size: 200,
    title: 'status',
  },
  {
    id: 'set_state',
    size: 200,
    title: 'State',
  },
];

export function toMarketItemRows(
  response: PaginationData<MarketItem[]>
): MarketItemRow[] {
  return response.data.map((marketItem) => ({
    id: marketItem.id,
    price: '$' + marketItem.price,
    location: marketItem.location,
    lego_set_name: marketItem.lego_set.name,
    seller_username: marketItem.seller.username,
    status:
      marketItem.status![0] +
      marketItem.status!.split('_').join(' ').toLowerCase().slice(1),
    set_state: setStates[marketItem.set_state as keyof typeof setStates],
  }));
}
