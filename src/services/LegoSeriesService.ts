import { LegoSeries, LegoSeriesSchema } from '../types/LegoSeries.ts';
import axios from 'axios';
import { handleIncorrectParse } from './ErrorHandlers.ts';

interface LegoSeriesService {
  GetLegoSeriesList: () => Promise<LegoSeries[]>;
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

export const legoSeriesService: LegoSeriesService = {
  GetLegoSeriesList: GetLegoSeriesList,
};
