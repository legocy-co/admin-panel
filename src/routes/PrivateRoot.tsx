import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';

type ProtectedRouteType = {
  children: JSX.Element;
};

const PrivateRoute = ({ children }: ProtectedRouteType) => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (!authService.IsAuthorized()) {
      navigate(`/auth/sign-in?from=${location.pathname}`);
    }
  }, []);

  return children;
};

export default PrivateRoute;
