import { LegoSeries } from '../../types/LegoSeriesType.ts';

export type SeriesRow = {
  id: number;
  name: string;
};

export const columns = [
  {
    id: 'name',
    size: 400,
    title: 'Series',
  },
];

export function toSeriesRows(response: LegoSeries[]): SeriesRow[] {
  return response.map((ser) => ({
    id: ser.id,
    name: ser.name,
  }));
}
