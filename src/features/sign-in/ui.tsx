import { FormEvent } from 'react';
import * as model from './model.ts';
import { useForm } from 'effector-forms';
import { useGate } from 'effector-react';
import { TextFieldAdapter } from '../../shared/ui/form-adapters.tsx';
import { FormError } from '../../shared/ui/form-error.tsx';
import { Button } from '../../shared/ui/button.tsx';

export const SignIn = () => {
  useGate(model.gate);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    model.form.submit();
  };

  const { fields, eachValid } = useForm(model.form);
  return (
    <form onSubmit={onSubmit} className="mt-7">
      <TextFieldAdapter
        field={model.form.fields.email}
        labelText="E-mail address"
        type="email"
      />
      <TextFieldAdapter
        field={model.form.fields.password}
        labelText="Password"
        type="password"
      />
      <div className="flex justify-center">
        {!eachValid && (
          <FormError>
            {fields.email.errorText() || fields.password.errorText()}
          </FormError>
        )}
        <Button className={'mt-14'} type="submit">
          Sign In
        </Button>
      </div>
    </form>
  );
};
