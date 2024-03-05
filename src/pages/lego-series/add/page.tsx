import { PageHeading } from '../../../shared/ui/page-heading.tsx';
import { LegoSeriesForm } from '../../../features/lego-series';

export const AddLegoSeriesPage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <PageHeading to={'/wiki/series'}>Add lego series</PageHeading>
      <LegoSeriesForm />
    </div>
  );
};
