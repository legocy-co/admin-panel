import { PageHeading } from '../../../shared/ui/page-heading.tsx';
import { history } from '../../../routes/history.ts';
import { MarketItemForm } from '../../../features/market-item';

export const UpdateMarketItemPage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <PageHeading
        to={'/market-items/' + history.location?.pathname.split('/')[3]}
      >
        Edit market item
      </PageHeading>
      <MarketItemForm />
    </div>
  );
};
