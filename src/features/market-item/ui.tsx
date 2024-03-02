import { useNavigate, useParams } from 'react-router-dom';
import { useGate, useUnit } from 'effector-react';
import { useForm } from 'effector-forms';
import React from 'react';
import {
  NumberFieldAdapter,
  SelectFieldAdapter,
  SelectSearchAdapter,
  TextareaFieldAdapter,
} from '../../shared/ui/form-adapters.tsx';
import cities from '../../../data/cities.json';
import { FormError } from '../../shared/ui/form-error.tsx';
import { Button } from '../../shared/ui/button.tsx';
import { $legoSetOptions } from '../lego-set/options/model.ts';
import { uo } from '../user/options/index.ts';
import * as model from './model.ts';
import { setStates, statuses } from '../../types/MarketItemType.ts';

export const MarketItemForm = () => {
  const params = useParams<'id'>();

  const legoSetOptions = useUnit($legoSetOptions);
  const userOptions = useUnit(uo.$userOptions);
  const navigateFn = useNavigate();

  useGate(model.gate, { id: params.id ?? null, navigateFn });

  const { fields, eachValid } = useForm(model.form);
  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    model.form.submit();
  }

  return (
    <form onSubmit={onSubmit} className="mt-7">
      <SelectSearchAdapter
        clientSideSearch
        field={model.form.fields.name}
        labelText="Lego set"
        options={legoSetOptions.map((set) => ({
          value: set.id,
          label: set.name,
        }))}
      />
      <TextareaFieldAdapter
        field={model.form.fields.description}
        labelText="Description"
      />
      <SelectFieldAdapter
        field={model.form.fields.country}
        options={[
          {
            value: '',
            label: 'Select country',
          },
          ...[...new Set(cities.map((city) => city.country))].map(
            (country) => ({ label: country, value: country })
          ),
        ]}
        defaultOptionValue=""
      />
      <SelectFieldAdapter
        field={model.form.fields.city}
        options={[
          { value: '', label: 'Select city' },
          ...cities
            .filter((city) => city.country === fields.country.value)
            .map((city) => city.name)
            .sort()
            .map((city) => ({ label: city, value: city })),
        ]}
        disabled={fields.country.value === ''}
        defaultOptionValue=""
      />
      <NumberFieldAdapter field={model.form.fields.price} labelText="Price" />
      <SelectFieldAdapter
        field={model.form.fields.set_state}
        options={[
          {
            value: '',
            label: 'Select state',
          },
          ...Object.entries(setStates).map((state) => ({
            label: state[1],
            value: state[0],
          })),
        ]}
        defaultOptionValue=""
      />
      <SelectSearchAdapter
        clientSideSearch
        field={model.form.fields.seller_id}
        labelText="Seller"
        options={userOptions.map((user) => ({
          value: user.id,
          label: user.username,
        }))}
      />
      <SelectFieldAdapter
        field={model.form.fields.status}
        options={[
          {
            value: '',
            label: 'Select status',
          },
          ...Object.entries(statuses).map((state) => ({
            label: state[1],
            value: state[0],
          })),
        ]}
        defaultOptionValue=""
      />
      <div className="relative flex justify-center">
        {!eachValid && (
          <FormError>
            {fields.name.errorText() ||
              fields.country.errorText() ||
              fields.city.errorText() ||
              fields.name.errorText() ||
              fields.price.errorText() ||
              fields.set_state.errorText() ||
              fields.seller_id.errorText() ||
              fields.status.errorText()}
          </FormError>
        )}
        <Button type="submit" className="my-14 w-64">
          {`${params.id ? 'Edit' : 'Add'} market item`}
        </Button>
      </div>
    </form>
  );
};
