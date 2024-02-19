const CREDENTIALS_LOCAL_STORAGE_KEY = 'legocy-credentials';

type CredentialsStorage = {
  accessToken: string;
  refreshToken: string;
};

const GetCredentials = (): CredentialsStorage => {
  const strStorage = localStorage.getItem(CREDENTIALS_LOCAL_STORAGE_KEY);

  let storage: CredentialsStorage = {
    accessToken: '',
    refreshToken: '',
  };

  if (strStorage) storage = JSON.parse(strStorage);
  return storage;
};

const SetCredentials = (storage: CredentialsStorage): void => {
  const strStorage = JSON.stringify(storage);
  localStorage.setItem(CREDENTIALS_LOCAL_STORAGE_KEY, strStorage);
};

export { GetCredentials, SetCredentials };
