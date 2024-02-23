import { useGate } from 'effector-react';
import * as model from './model.ts';
import { useForm } from 'effector-forms';
import React from 'react';
import { NumberFieldAdapter } from '../../shared/ui/form-adapters.tsx';
import { FormError } from '../../shared/ui/form-error.tsx';
import { Button } from '../../shared/ui/button.tsx';

type Props = {
  lego_set_id: string | null;
  state: string;
  id: string;
};

export const ValuationForm = (props: Props) => {
  const state = props.state;

  useGate(model.gate, { state: state, lego_set_id: props.lego_set_id ?? null });

  const { fields, eachValid } = useForm(model.form);
  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    model.form.submit();
  }

  return (
    <form onSubmit={onSubmit} id={props.id} className="mt-7">
      <NumberFieldAdapter
        id={props.id}
        field={model.form.fields.valuation}
        labelText=""
      />
      <div className="flex justify-center">
        {!eachValid && <FormError>{fields.valuation.errorText()}</FormError>}
        <Button type="submit" className="mt-14 w-64">
          &gt;
        </Button>
      </div>
    </form>
  );
};
