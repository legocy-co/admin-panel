import { Outlet } from 'react-router-dom';
import { Navbar } from '../../shared/ui/navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavIcon from '../../shared/icons/nav.svg?react';
import { useState } from 'react';

// TODO: center page content

const RootPage = () => {
  const [isNavHidden, setNavHidden] = useState(false);

  return (
    <>
      <button
        className="w-10 h-10 absolute bg-none"
        onClick={() => setNavHidden(!isNavHidden)}
      >
        <NavIcon />
      </button>
      <div className="w-full h-screen grid grid-cols-auto-1fr">
        <Navbar isHidden={isNavHidden} />
        <div className="w-full px-10 py-10 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </div>
      </div>
      <ToastContainer />
      <div id="portal_root" />
    </>
  );
};

export default RootPage;
