import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
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
import LegoSetsPage from '../pages/lego-sets';
import LegoSetDetailPage from '../pages/lego-sets/detail';
import AddLegoSetPage from '../pages/lego-sets/add';
import UpdateLegoSetPage from '../pages/lego-sets/update';

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
      >
        <Route index element={<Navigate to="wiki/sets" />} />
        <Route path="wiki/sets" element={<Outlet />}>
          <Route index element={<LegoSetsPage />} />
          <Route path="add" element={<AddLegoSetPage />} />
          <Route path=":id" element={<LegoSetDetailPage />} />
          <Route path="update/:id" element={<UpdateLegoSetPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
