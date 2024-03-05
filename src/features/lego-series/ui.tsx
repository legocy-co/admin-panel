import { useNavigate, useParams } from 'react-router-dom';
import { useGate } from 'effector-react';
import * as model from './model.ts';
import { useForm } from 'effector-forms';
import React from 'react';
import { TextFieldAdapter } from '../../shared/ui/form-adapters.tsx';
import { FormError } from '../../shared/ui/form-error.tsx';
import { Button } from '../../shared/ui/button.tsx';

export const LegoSeriesForm = () => {
  const params = useParams<'id'>();

  const navigateFn = useNavigate();

  useGate(model.gate, { id: params.id ?? null, navigateFn });

  const { fields, eachValid } = useForm(model.form);
  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    model.form.submit();
  }

  return (
    <form onSubmit={onSubmit} className="mt-7">
      <TextFieldAdapter field={model.form.fields.name} labelText="Name" />
      <div className="relative flex justify-center">
        {!eachValid && <FormError>{fields.name.errorText()}</FormError>}
        <Button type="submit" className="mt-14 w-64">
          {`${params.id ? 'Update' : 'Add'} lego series`}
        </Button>
      </div>
    </form>
  );
};
