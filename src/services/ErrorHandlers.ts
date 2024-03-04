import { SignInForm } from '../types/SignIn.ts';
import axios, { AxiosError } from 'axios';
import { ZodError } from 'zod';
import toaster from '../shared/lib/react-toastify.ts';
import { LegoSetForm } from '../types/LegoSetType.ts';
import { MarketItemForm } from '../types/MarketItemType.ts';
import { RegisterAdminForm, UserForm } from '../types/UserType.ts';

const handleIncorrectParse = (
  e: ZodError,
  consolePrefix: string,
  toasterMessage: string
): Promise<never> => {
  console.error(consolePrefix + ': cannot parse incoming data:', e);
  toaster.showToastError(toasterMessage + ': incorrect incoming data');
  return Promise.reject(e.format());
};

const handleUserError = (
  e: unknown,
  consolePrefix: string,
  form: SignInForm | RegisterAdminForm | UserForm
): Promise<never> => {
  if (axios.isAxiosError(e)) {
    const err = e as AxiosError;
    const errorMessage = (err.response?.data as any)?.error ?? err.message;
    console.error(
      `${consolePrefix}: code = ${err.response?.status}, msg = ${errorMessage}`
    );

    form.fields.email.addError({
      rule: '',
      errorText: errorMessage,
    });

    return Promise.reject(err.message);
  }

  console.error(`${consolePrefix}: undefined error: `, e);
  return Promise.reject(e);
};

const handleSetError = (
  e: unknown,
  consolePrefix: string,
  form: LegoSetForm | MarketItemForm
): Promise<never> => {
  if (axios.isAxiosError(e)) {
    const err = e as AxiosError;
    const errorMessage = (err.response?.data as any)?.error ?? err.message;
    console.error(
      `${consolePrefix}: code = ${err.response?.status}, msg = ${errorMessage}`
    );

    form.fields.name.addError({
      rule: '',
      errorText: errorMessage,
    });

    return Promise.reject(err.message);
  }

  console.error(`${consolePrefix}: undefined error: `, e);
  return Promise.reject(e);
};

export { handleIncorrectParse, handleUserError, handleSetError };
