import axios from 'axios';
import { handleIncorrectParse } from './ErrorHandlers.ts';
import { PaginationData } from '../types/pagination.ts';
import { LegoSet, LegoSetSchema } from '../types/LegoSetType.ts';

interface LegoSetService {
  GetLegoSetsPage: (query: string) => Promise<PaginationData<LegoSet[]>>;
  GetLegoSets: () => Promise<LegoSet[]>;
  GetLegoSet: (id: number | string) => Promise<LegoSet>;
}

const GetLegoSetsPage = async (
  query: string
): Promise<PaginationData<LegoSet[]>> => {
  const { data } = await axios.get('/sets/' + query);
  const result = LegoSetSchema.array().safeParse(data.data);
  if (!result.success)
    return handleIncorrectParse(
      result.error,
      'GetLegoSetsPage',
      "Can't get lego sets page"
    );

  return data;
};

const GetLegoSets = async (): Promise<LegoSet[]> => {
  const response = await axios.get<object[]>('/sets/all');
  const result = LegoSetSchema.array().safeParse(response.data);
  if (!result.success)
    return handleIncorrectParse(
      result.error,
      'GetLegoSets',
      "Can't get lego sets"
    );

  return result.data;
};

const GetLegoSet = async (id: number | string): Promise<LegoSet> => {
  const response = await axios.get<object>('/sets/' + id);
  const result = LegoSetSchema.safeParse(response.data);
  if (!result.success)
    return handleIncorrectParse(
      result.error,
      'GetLegoSet',
      "Can't get lego set"
    );

  return result.data;
};

export const legoSetService: LegoSetService = {
  GetLegoSetsPage: GetLegoSetsPage,
  GetLegoSets: GetLegoSets,
  GetLegoSet: GetLegoSet,
};
