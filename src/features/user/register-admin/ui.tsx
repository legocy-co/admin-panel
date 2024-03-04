import { useGate } from 'effector-react';
import * as model from './model.ts';
import { useForm } from 'effector-forms';
import { FormEvent } from 'react';
import { TextFieldAdapter } from '../../../shared/ui/form-adapters.tsx';
import { FormError } from '../../../shared/ui/form-error.tsx';
import { Button } from '../../../shared/ui/button.tsx';

export const RegisterAdmin = () => {
  useGate(model.gate);

  const { fields, eachValid } = useForm(model.form);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    model.form.submit();
  };

  return (
    <form onSubmit={onSubmit}>
      <TextFieldAdapter
        field={model.form.fields.username}
        labelText="Username"
      />
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
      <TextFieldAdapter
        field={model.form.fields.passwordConfirm}
        labelText="Confirm password"
        type="password"
      />
      <div className="relative flex justify-center">
        {!eachValid && (
          <FormError>
            {fields.username.errorText() ||
              fields.email.errorText() ||
              fields.password.errorText() ||
              fields.passwordConfirm.errorText()}
          </FormError>
        )}
        <Button className="mt-20" type="submit">
          Register admin
        </Button>
      </div>
    </form>
  );
};
