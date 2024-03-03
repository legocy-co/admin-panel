import { PageHeading } from '../../../shared/ui/page-heading.tsx';
import { LegoSetForm } from '../../../features/lego-set';
import { history } from '../../../routes/history.ts';

export const UpdateLegoSetPage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <PageHeading
        to={'/wiki/sets/' + history.location?.pathname.split('/')[3]}
      >
        Edit lego set
      </PageHeading>
      <LegoSetForm />
    </div>
  );
};
