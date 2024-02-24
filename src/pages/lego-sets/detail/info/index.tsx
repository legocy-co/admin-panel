import { lazy, Suspense } from 'react';
import Loader from '../../../../shared/ui/loader.tsx';

export { LegoSetDetailInfoPage } from './page.tsx';
export * as lsf from './model.ts';

const LegoSetDetailInfoPage = lazy(() =>
  import('./page.tsx').then((page) => ({ default: page.LegoSetDetailInfoPage }))
);

export const LegoSetDetailInfoRoute = () => (
  <Suspense fallback={<Loader />}>
    <LegoSetDetailInfoPage />
  </Suspense>
);
