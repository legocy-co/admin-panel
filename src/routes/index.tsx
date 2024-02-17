import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { history } from './history.ts';
import { useEffect } from 'react';
import {
  locationChanged,
  navigateChanged,
} from '../shared/lib/react-router.ts';
import RootPage from '../pages/RootPage';

const AppRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    navigateChanged(navigate);
  }, [navigate]);

  useEffect(() => {
    locationChanged(location);
  }, [location]);

  history.navigate = navigate;
  history.location = location;

  return (
    <Routes>
      <Route path="/" element={<RootPage />}></Route>
      <Route path="/sign-in" element={<RootPage />}></Route>
    </Routes>
  );
};

export default AppRouter;
