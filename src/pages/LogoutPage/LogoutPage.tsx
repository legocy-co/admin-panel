import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService.ts';

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    authService.Logout();
    navigate('/auth/sign-in');
  }, []);

  return <></>;
};

export default LogoutPage;
