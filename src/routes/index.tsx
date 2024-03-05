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
import MarketItemsPage from '../pages/market-items';
import AddMarketItemPage from '../pages/market-items/add';
import { MarketItemDetailPage } from '../pages/market-items/detail';
import UpdateMarketItemPage from '../pages/market-items/update';
import UsersPage from '../pages/users/index.tsx';
import RegisterAdminPage from '../pages/users/register-admin/index.tsx';
import { UserDetailPage } from '../pages/users/detail';
import UpdateUserPage from '../pages/users/update/index.tsx';
import { LegoSeriesPage } from '../pages/lego-series/page.tsx';
import AddLegoSeriesPage from '../pages/lego-series/add/index.tsx';

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
        {/*private pages*/}

        <Route path="wiki" element={<Outlet />}>
          <Route index element={<Navigate to="/" />} />
          {/*lego wiki pages*/}

          <Route path="sets" element={<Outlet />}>
            <Route index element={<LegoSetsPage />} />
            <Route path="add" element={<AddLegoSetPage />} />
            <Route path=":id" element={<LegoSetDetailPage />} />
            <Route path="update/:id" element={<UpdateLegoSetPage />} />
          </Route>

          <Route path="series" element={<Outlet />}>
            <Route index element={<LegoSeriesPage />} />
            <Route path="add" element={<AddLegoSeriesPage />} />
          </Route>
        </Route>

        <Route path="market-items" element={<Outlet />}>
          <Route index element={<MarketItemsPage />} />
          <Route path="add" element={<AddMarketItemPage />} />
          <Route path=":id" element={<MarketItemDetailPage />} />
          <Route path="update/:id" element={<UpdateMarketItemPage />} />
        </Route>

        <Route path="users" element={<Outlet />}>
          <Route index element={<UsersPage />} />
          <Route path=":id" element={<UserDetailPage />} />
          <Route path="update/:id" element={<UpdateUserPage />} />
        </Route>

        <Route path="register-admin" element={<RegisterAdminPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
