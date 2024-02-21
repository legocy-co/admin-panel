import axios from 'axios';
import { handleIncorrectParse, handleSetError } from './ErrorHandlers.ts';
import { PaginationData } from '../types/pagination.ts';
import { LegoSet, LegoSetData, LegoSetSchema } from '../types/LegoSetType.ts';
import toaster from '../shared/lib/react-toastify.ts';
import { lsf } from '../features/lego-set/index.tsx';

interface LegoSetService {
  GetLegoSetsPage: (query: string) => Promise<PaginationData<LegoSet[]>>;
  GetLegoSets: () => Promise<LegoSet[]>;
  GetLegoSet: (id: number | string) => Promise<LegoSet>;
  CreateLegoSet: (legoSet: LegoSetData) => Promise<boolean>;
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

const CreateLegoSet = async (legoSet: LegoSetData): Promise<boolean> => {
  try {
    await axios.post('/admin/sets/', legoSet);
    toaster.showToastSuccess('Lego set created');

    return Promise.resolve(true);
  } catch (e) {
    return handleSetError(e, 'LegoSet', lsf.form);
  }
};

export const legoSetService: LegoSetService = {
  GetLegoSetsPage: GetLegoSetsPage,
  GetLegoSets: GetLegoSets,
  GetLegoSet: GetLegoSet,
  CreateLegoSet: CreateLegoSet,
};
