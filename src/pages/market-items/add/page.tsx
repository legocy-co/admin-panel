import { MarketItemForm } from '../../../features/market-item';
import { PageHeading } from '../../../shared/ui/page-heading.tsx';

export const AddMarketItemPage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <PageHeading to={'/market-items'}>Add market item</PageHeading>
      <MarketItemForm />
    </div>
  );
};
