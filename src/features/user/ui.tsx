import { useGate } from 'effector-react';
import * as model from './model.ts';
import { useForm } from 'effector-forms';
import { FormEvent } from 'react';
import {
  SelectFieldAdapter,
  TextFieldAdapter,
} from '../../shared/ui/form-adapters.tsx';
import { FormError } from '../../shared/ui/form-error.tsx';
import { Button } from '../../shared/ui/button.tsx';
import { useNavigate, useParams } from 'react-router-dom';

export const UserForm = () => {
  const params = useParams<'id'>();
  const navigateFn = useNavigate();

  useGate(model.gate, { id: params.id ?? null, navigateFn });

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
      <SelectFieldAdapter
        field={model.form.fields.role}
        options={[
          {
            value: '0',
            label: 'User',
          },
          {
            value: '1',
            label: 'Admin',
          },
        ]}
        defaultOptionValue="0"
      />
      <div className="relative flex justify-center">
        {!eachValid && (
          <FormError>
            {fields.username.errorText() ||
              fields.email.errorText() ||
              fields.role.errorText()}
          </FormError>
        )}
        <Button className="mt-20" type="submit">
          Update user
        </Button>
      </div>
    </form>
  );
};
