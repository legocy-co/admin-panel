import { lazy, Suspense } from 'react';
import Loader from '../../../../shared/ui/loader.tsx';

export { LegoSetDetailInfo } from './page.tsx';
export * as lsf from './model.ts';

const LegoSetInfo = lazy(() =>
  import('./page.tsx').then((page) => ({ default: page.LegoSetDetailInfo }))
);

export const LegoSetDetailInfoRoute = () => (
  <Suspense fallback={<Loader />}>
    <LegoSetInfo />
  </Suspense>
);
