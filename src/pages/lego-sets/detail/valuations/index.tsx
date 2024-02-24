import { lazy, Suspense } from 'react';
import Loader from '../../../../shared/ui/loader.tsx';

const LegoSetDetailValuationsPage = lazy(() =>
  import('./page.tsx').then((page) => ({
    default: page.LegoSetDetailValuationsPage,
  }))
);

export const LegoSetDetailValuationsRoute = () => (
  <Suspense fallback={<Loader />}>
    <LegoSetDetailValuationsPage />
  </Suspense>
);
