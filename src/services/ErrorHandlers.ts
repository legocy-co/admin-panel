import { SignInForm } from '../types/SignIn.ts';
import axios, { AxiosError } from 'axios';

const handleUserError = (
  e: unknown,
  consolePrefix: string,
  form: SignInForm
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

export { handleUserError };
