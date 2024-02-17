import { Outlet } from 'react-router-dom';
import { clsx } from 'clsx';
import { Navbar } from '../../shared/ui/navbar';

const RootPage = () => {
  const isOpenedInIframe = window.self !== window.top;

  return (
    <>
      <div className="w-full h-full">
        {!isOpenedInIframe && <Navbar />}
        <div
          className={clsx(
            'w-full px-6 py-5 overflow-x-hidden overflow-y-auto',
            {
              'col-span-2': isOpenedInIframe,
            }
          )}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default RootPage;
