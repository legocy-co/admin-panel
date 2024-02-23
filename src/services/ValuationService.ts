import {
  Valuation,
  ValuationData,
  ValuationSchema,
} from '../types/ValuationType.ts';
import axios from 'axios';
import { handleIncorrectParse } from './ErrorHandlers.ts';

export interface ValuationService {
  GetLegoSetValuations: (legoSetID: number | string) => Promise<Valuation[]>;
  CreateValuation: (data: ValuationData) => Promise<boolean>;
  GetValuation: (id: number | string) => Promise<Valuation>;
  UpdateValuation: (
    data: ValuationData,
    id: number | string
  ) => Promise<boolean>;
  DeleteValuation: (id: number | string) => Promise<boolean>;
}

const GetLegoSetValuations = async (
  legoSetID: number | string
): Promise<Valuation[]> => {
  const response = await axios.get<object[]>('/sets-valuations/' + legoSetID);
  const result = ValuationSchema.array().safeParse(response.data);
  if (!result.success)
    return handleIncorrectParse(
      result.error,
      'GetLegoSetValuations',
      "Can't get valuations"
    );

  return result.data;
};

const CreateValuation = async (data: ValuationData): Promise<boolean> => {
  try {
    await axios.post('/admin/sets-valuations/', data);
    return Promise.resolve(true);
  } catch (e) {
    return Promise.reject(e);
  }
};

const GetValuation = async (id: number | string): Promise<Valuation> => {
  const response = await axios.get<object>('/admin/sets-valuations/' + id);
  const result = ValuationSchema.safeParse(response.data);
  if (!result.success)
    return handleIncorrectParse(
      result.error,
      'GetValuation',
      "Can't get valuation"
    );

  return result.data;
};

const UpdateValuation = async (
  data: ValuationData,
  id: number | string
): Promise<boolean> => {
  try {
    await axios.put('/admin/sets-valuations/' + id, data);
    return Promise.resolve(true);
  } catch (e) {
    return Promise.reject(e);
  }
};

const DeleteValuation = async (id: number | string): Promise<boolean> => {
  try {
    await axios.delete('/admin/sets' + id);
    return Promise.resolve(true);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const valuationService: ValuationService = {
  GetLegoSetValuations: GetLegoSetValuations,
  CreateValuation: CreateValuation,
  GetValuation: GetValuation,
  UpdateValuation: UpdateValuation,
  DeleteValuation: DeleteValuation,
};
