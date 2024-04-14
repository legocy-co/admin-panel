import { GetCredentials, SetCredentials } from '../storage/credentials.ts';
import { SignInData } from '../types/SignIn.ts';
import axios from 'axios';
import { history } from '../routes/history.ts';
import { jwtDecode } from 'jwt-decode';
import { handleUserError } from './ErrorHandlers.ts';
import { si } from '../features/sign-in/index.tsx';

export interface AuthService {
  IsAuthorized: () => boolean;
  SignIn: (data: SignInData) => void;
  RefreshToken: () => void;
  Logout: () => void;
}

export interface TokenType {
  id: number;
  email: string;
  role: number;
  exp: number;
}

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

type RefreshTokenResponse = {
  accessToken: string;
};

const IsAuthorized = () => {
  const storage = GetCredentials();
  return storage.accessToken !== '';
};

const SignIn = async (data: SignInData) => {
  try {
    const response = await axios
      .post<AuthResponse>('/admin/users/auth/sign-in', data)
      .then((response) => response.data);

    const storage = GetCredentials();
    storage.accessToken = response.accessToken;
    storage.refreshToken = response.refreshToken;
    SetCredentials(storage);

    axios.defaults.headers.common.Authorization = GetAccessTokenHeader();
  } catch (e) {
    return handleUserError(e, 'SignIn', si.form);
  }
};

const RefreshToken = async () => {
  const storage = GetCredentials();
  const response = await axios
    .post<RefreshTokenResponse>('/users/auth/refresh', {
      refresh_token: storage.refreshToken,
    })
    .then((response) => response.data);

  storage.accessToken = response.accessToken;
  SetCredentials(storage);
};

const Logout = () => {
  const storage = GetCredentials();
  storage.accessToken = '';
  storage.refreshToken = '';
  SetCredentials(storage);

  axios.defaults.headers.common.Authorization = '';
  history.navigate(`auth/sign-in?from=${history.location?.pathname}`);
};

export const authService: AuthService = {
  IsAuthorized: IsAuthorized,
  SignIn: SignIn,
  RefreshToken: RefreshToken,
  Logout: Logout,
};

const GetAccessTokenHeader = () => {
  const storage = GetCredentials();
  return `Bearer ${storage.accessToken}`;
};

const GetBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_ENDPOINT;
  if (baseUrl) return baseUrl;
  return '/api/v1';
};

axios.defaults.baseURL = GetBaseUrl();
axios.defaults.headers.common.Authorization = IsAuthorized()
  ? GetAccessTokenHeader()
  : '';

axios.interceptors.request.use(
  async (request) => {
    const storage = GetCredentials();
    if (storage.refreshToken) {
      const decodedRefresh = jwtDecode<TokenType>(storage.refreshToken);

      if (Math.floor(Date.now() / 1000) > decodedRefresh.exp - 60) {
        Logout();
      }
    }

    return request;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  async (err) => {
    if (err?.response?.status === 401) {
      try {
        await RefreshToken();

        axios.defaults.headers.common.Authorization = GetAccessTokenHeader();
      } catch (e) {
        Logout();
        return Promise.reject(err);
      }

      if (err?.config.headers)
        err.config.headers.Authorization = GetAccessTokenHeader();

      return axios(err?.config);
    }

    return Promise.reject(err);
  }
);
