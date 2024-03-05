import { PageHeading } from '../../../shared/ui/page-heading.tsx';
import { LegoSeriesForm } from '../../../features/lego-series';

export const UpdateLegoSeriesPage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <PageHeading to={'/wiki/series'}>Update lego series</PageHeading>
      <LegoSeriesForm />
    </div>
  );
};
