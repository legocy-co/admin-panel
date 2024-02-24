import { Button } from '../../shared/ui/button.tsx';
import { FormError } from '../../shared/ui/form-error.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { useGate, useUnit } from 'effector-react';
import { useForm } from 'effector-forms';
import * as model from './model.ts';
import React from 'react';
import {
  NumberFieldAdapter,
  SelectSearchAdapter,
  TextFieldAdapter,
} from '../../shared/ui/form-adapters.tsx';
import { lso } from '../lego-series/options/index.ts';

export const LegoSetForm = () => {
  const params = useParams<'id'>();

  const legoSer = useUnit(lso.$legoSeriesOptions);
  const navigateFn = useNavigate();

  useGate(model.gate, { id: params.id ?? null, navigateFn });

  const { fields, eachValid } = useForm(model.form);
  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    model.form.submit();
  }

  return (
    <form onSubmit={onSubmit} className="mt-7">
      <NumberFieldAdapter
        field={model.form.fields.n_pieces}
        labelText="Number of pieces"
      />
      <TextFieldAdapter field={model.form.fields.name} labelText="Name" />
      <NumberFieldAdapter
        field={model.form.fields.number}
        labelText="Set number"
      />
      <SelectSearchAdapter
        clientSideSearch
        field={model.form.fields.series_id}
        labelText="Lego series"
        options={legoSer.map((ser) => ({
          value: ser.id,
          label: ser.name,
        }))}
      />
      <div className="relative flex justify-center">
        {!eachValid && (
          <FormError>
            {fields.n_pieces.errorText() ||
              fields.name.errorText() ||
              fields.number.errorText() ||
              fields.series_id.errorText()}
          </FormError>
        )}
        <Button type="submit" className="mt-14 w-64">
          {params.id ? 'Edit lego set' : 'Add lego set'}
        </Button>
      </div>
    </form>
  );
};
