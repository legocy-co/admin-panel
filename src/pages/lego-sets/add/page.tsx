import { PageHeading } from '../../../shared/ui/page-heading.tsx';
import { LegoSetForm } from '../../../features/lego-set';

export const AddLegoSetPage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <PageHeading to={'/wiki/sets'}>Add lego set</PageHeading>
      <LegoSetForm />
    </div>
  );
};
