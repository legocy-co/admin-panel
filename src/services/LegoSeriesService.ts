import {
  LegoSeries,
  LegoSeriesData,
  LegoSeriesSchema,
} from '../types/LegoSeriesType.ts';
import axios from 'axios';
import { handleIncorrectParse } from './ErrorHandlers.ts';
import toaster from '../shared/lib/react-toastify.ts';

interface LegoSeriesService {
  GetLegoSeriesList: () => Promise<LegoSeries[]>;
  GetLegoSeries: (id: number | string) => Promise<LegoSeries>;
  CreateLegoSeries: (legoSeries: LegoSeriesData) => Promise<boolean>;
  UpdateLegoSeries: (
    legoSeries: LegoSeriesData,
    id: number | string
  ) => Promise<boolean>;
  DeleteLegoSeries: (id: number | string) => Promise<boolean>;
}

const GetLegoSeriesList = async (): Promise<LegoSeries[]> => {
  const response = await axios.get<object[]>('/series/');
  const result = LegoSeriesSchema.array().safeParse(response.data);
  if (!result.success)
    return handleIncorrectParse(
      result.error,
      'GetLegoSeriesList',
      "Can't get lego series list"
    );

  return result.data;
};

const GetLegoSeries = async (id: number | string): Promise<LegoSeries> => {
  const response = await axios.get<object>('/series/' + id);
  const result = LegoSeriesSchema.safeParse(response.data);
  if (!result.success)
    return handleIncorrectParse(
      result.error,
      'GetLegoSeries',
      "Can't get lego series"
    );

  return result.data;
};

const CreateLegoSeries = async (
  legoSeries: LegoSeriesData
): Promise<boolean> => {
  try {
    await axios.post('/admin/series/', legoSeries);
    toaster.showToastSuccess('Lego series created');

    return Promise.resolve(true);
  } catch (e) {
    return Promise.reject(e);
    // return handleSetError(e, 'LegoSet', legoSeriesForm.form);
  }
};

const UpdateLegoSeries = async (
  legoSeries: LegoSeriesData,
  id: number | string
): Promise<boolean> => {
  try {
    await axios.put('/admin/series/' + id, legoSeries);
    toaster.showToastSuccess('Lego series updated');

    return Promise.resolve(true);
  } catch (e) {
    return Promise.reject(e);
    // return handleSetError(e, 'UpdateLegoSet', legoSeriesForm.form);
  }
};

const DeleteLegoSeries = async (id: number | string): Promise<boolean> => {
  try {
    await axios.delete('/admin/series/' + id);
    toaster.showToastSuccess('Lego series deleted');

    return Promise.resolve(true);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const legoSeriesService: LegoSeriesService = {
  GetLegoSeriesList: GetLegoSeriesList,
  GetLegoSeries: GetLegoSeries,
  CreateLegoSeries: CreateLegoSeries,
  UpdateLegoSeries: UpdateLegoSeries,
  DeleteLegoSeries: DeleteLegoSeries,
};
