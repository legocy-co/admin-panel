import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { history } from './history.ts';
import { useEffect } from 'react';
import {
  locationChanged,
  navigateChanged,
} from '../shared/lib/react-router.ts';
import RootPage from '../pages/RootPage';
import PrivateRoute from './PrivateRoot.tsx';
import LogoutPage from '../pages/LogoutPage';
import SignInPage from '../pages/SignInPage';

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
      <Route path="auth/sign-in" element={<SignInPage />} />
      <Route path="auth/logout" element={<LogoutPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <RootPage />
          </PrivateRoute>
        }
      ></Route>
    </Routes>
  );
};

export default AppRouter;
