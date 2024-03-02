import { PageHeading } from '../../../shared/ui/page-heading.tsx';
import { LegoSetForm } from '../../../features/lego-set';
import { history } from '../../../routes/history.ts';

export const UpdateMarketItemPage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <PageHeading
        to={'/market-items/' + history.location?.pathname.split('/')[2]}
      >
        Edit lego set
      </PageHeading>
      <LegoSetForm />
    </div>
  );
};
