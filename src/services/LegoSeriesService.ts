import { LegoSeriesType, LegoSeriesSchema } from '../types/LegoSeriesType.ts';
import axios from 'axios';
import { handleIncorrectParse } from './ErrorHandlers.ts';

interface LegoSeriesService {
  GetLegoSeriesList: () => Promise<LegoSeriesType[]>;
}

const GetLegoSeriesList = async (): Promise<LegoSeriesType[]> => {
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

export const legoSeriesService: LegoSeriesService = {
  GetLegoSeriesList: GetLegoSeriesList,
};
