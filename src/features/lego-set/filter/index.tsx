import { legoSetFilterFactory } from './model.ts';
import { ActiveFilters, LegoSetsFilter as View } from './ui';

export const LegoSetsFilter = {
  factory: legoSetFilterFactory,
  View,
  ActiveFilters,
};
