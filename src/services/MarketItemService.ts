import { PaginationData } from '../types/pagination.ts';
import {
  MarketItem,
  MarketItemData,
  MarketItemSchema,
} from '../types/MarketItemType.ts';

import toaster from '../shared/lib/react-toastify.ts';
import { handleIncorrectParse, handleSetError } from './ErrorHandlers.ts';
import axios from 'axios';
import { mif } from '../features/market-item/index.tsx';

interface MarketItemService {
  CreateMarketItem: (marketItem: MarketItemData) => Promise<boolean>;
  GetMarketItem: (id: number | string) => Promise<MarketItem>;
  UpdateMarketItem: (
    id: number | string,
    marketItem: MarketItemData
  ) => Promise<boolean>;
  GetMarketItemsPage: (query: string) => Promise<PaginationData<MarketItem[]>>;
  DeleteMarketItem: (id: number | string) => Promise<boolean>;
  UploadImage: (file: FormData, id: number | string) => Promise<boolean>;
  DeleteImage: (id: number | string) => Promise<boolean>;
}

const CreateMarketItem = async (
  marketItem: MarketItemData
): Promise<boolean> => {
  try {
    await axios.post('/admin/market-items/', marketItem);
    toaster.showToastSuccess('Market item created');

    return Promise.resolve(true);
  } catch (e) {
    return handleSetError(e, 'MarketItem', mif.form);
  }
};

const GetMarketItem = async (id: number | string): Promise<MarketItem> => {
  const response = await axios.get<object>('/admin/market-items/' + id);
  const result = MarketItemSchema.safeParse(response.data);
  if (!result.success)
    return handleIncorrectParse(
      result.error,
      'GetMarketItem',
      "Can't get market item"
    );

  return result.data;
};

const UpdateMarketItem = async (
  id: number | string,
  marketItem: MarketItemData
): Promise<boolean> => {
  try {
    await axios.put('/admin/market-items/' + id, marketItem);
    toaster.showToastSuccess('Market item updated');

    return Promise.resolve(true);
  } catch (e) {
    return Promise.reject(e);
  }
};

const GetMarketItemsPage = async (
  query: string
): Promise<PaginationData<MarketItem[]>> => {
  const { data } = await axios.get('/admin/market-items/' + query);
  const result = MarketItemSchema.array().safeParse(data.data);
  if (!result.success)
    return handleIncorrectParse(
      result.error,
      'GetLegoSetsPage',
      "Can't get lego sets page"
    );

  return data;
};

const DeleteMarketItem = async (id: number | string): Promise<boolean> => {
  try {
    await axios.delete('/market-items/' + id);
    toaster.showToastSuccess('Market item deleted');

    return Promise.resolve(true);
  } catch (e) {
    return Promise.reject(e);
  }
};

const UploadImage = async (
  file: FormData,
  id: number | string
): Promise<boolean> => {
  try {
    await axios.post('/admin/market-items/images/' + id, file);
    toaster.showToastSuccess('Image uploaded');

    return Promise.resolve(true);
  } catch (e) {
    return Promise.reject(e);
  }
};

const DeleteImage = async (id: number | string): Promise<boolean> => {
  try {
    await axios.delete('/admin/market-items/images/' + id);
    toaster.showToastSuccess('Image deleted');

    return Promise.resolve(true);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const marketItemService: MarketItemService = {
  CreateMarketItem: CreateMarketItem,
  GetMarketItem: GetMarketItem,
  UpdateMarketItem: UpdateMarketItem,
  GetMarketItemsPage: GetMarketItemsPage,
  DeleteMarketItem: DeleteMarketItem,
  UploadImage: UploadImage,
  DeleteImage: DeleteImage,
};
