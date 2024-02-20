import { Outlet } from 'react-router-dom';
import { Navbar } from '../../shared/ui/navbar';
import { ToastContainer } from 'react-toastify';

const RootPage = () => {
  return (
    <>
      <div className="w-full h-screen grid grid-cols-auto-1fr">
        <Navbar />

        <div className="w-full px-10 py-10 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </div>
        <div id="portal_root" />
      </div>
      <ToastContainer />
    </>
  );
};

export default RootPage;
