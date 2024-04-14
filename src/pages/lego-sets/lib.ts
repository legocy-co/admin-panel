import { PaginationData } from '../../types/pagination.ts';
import { LegoSet } from '../../types/LegoSetType.ts';

export type SetRow = {
  id: number;
  image?: string;
  name: string;
  number: number;
  pieces: number;
  series: string;
};

export const columns = [
  {
    id: 'number',
    size: 200,
    title: 'Set number',
  },
  {
    id: 'name',
    size: 400,
    title: 'Set',
  },
  {
    id: 'pieces',
    size: 200,
    title: 'Pieces',
  },
  {
    id: 'image',
    size: 200,
    title: 'Image',
  },
  {
    id: 'series',
    size: 400,
    title: 'Series',
  },
];

export function toSetRows(response: PaginationData<LegoSet[]>): SetRow[] {
  return response.data.map((set) => ({
    id: set.id,
    image: set.images
      ?.sort((current, next) => Number(current.isMain) - Number(next.isMain))
      .map((img) => img.imageURL)[0],
    name: set.name,
    number: set.number,
    pieces: set.nPieces,
    series: set.series.name,
  }));
}
