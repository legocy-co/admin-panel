import { SignIn } from '../../features/sign-in';
import { useGate } from 'effector-react';
import * as model from './model.ts';

export const SignInPage = () => {
  useGate(model.Gate);

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <img src="/logo.svg" alt="" />
      <SignIn />
    </div>
  );
};
