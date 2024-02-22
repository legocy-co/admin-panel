import { Valuation, ValuationSchema } from '../types/ValuationType.ts';
import axios from 'axios';
import { handleIncorrectParse } from './ErrorHandlers.ts';

export interface ValuationService {
  GetValuations: (legoSetID: number | string) => Promise<Valuation[]>;
}

const GetValuations = async (
  legoSetID: number | string
): Promise<Valuation[]> => {
  const response = await axios.get<object[]>('/sets-valuations/' + legoSetID);
  const result = ValuationSchema.array().safeParse(response.data);
  if (!result.success)
    return handleIncorrectParse(
      result.error,
      'GetValuations',
      "Can't get valuations"
    );

  return result.data;
};

export const valuationService: ValuationService = {
  GetValuations: GetValuations,
};
