import { useGate, useUnit } from 'effector-react';
import * as model from './model.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { setStates } from '../../types/MarketItemType.ts';
import React from 'react';
import { NumberFieldAdapter } from '../../shared/ui/form-adapters.tsx';
import { Button } from '../../shared/ui/button.tsx';
import { useForm } from 'effector-forms';
import { FormError } from '../../shared/ui/form-error.tsx';
import clsx from 'clsx';

export const ValuationsForm = () => {
  const params = useParams<'id'>();
  const navigate = useNavigate();
  const detailValuations = useUnit(model.$detailValuations);

  useGate(model.gate, { id: params.id ?? null, navigate });

  const valuationsElement = Object.keys(setStates).map((state) => (
    <div key={'valuations-' + state} className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <p
          className={clsx('font-normal', {
            'text-rose': !detailValuations.find(
              (valuation) => valuation.state === state
            ),
          })}
        >
          {setStates[state as keyof typeof setStates]}
        </p>
      </div>
      <NumberFieldAdapter
        field={model.form.fields[`${state}` as keyof typeof setStates]}
        labelText=""
      />
    </div>
  ));

  const { fields, eachValid } = useForm(model.form);

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    model.form.submit();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-flow-col gap-10 grid-rows-3 mt-7 transition-all"
    >
      {valuationsElement}
      <div className="relative flex justify-center">
        {!eachValid && (
          <FormError>
            {fields.BRAND_NEW.errorText() ||
              fields.BOX_OPENED.errorText() ||
              fields.BAGS_OPENED.errorText() ||
              fields.BUILT_WITH_BOX.errorText() ||
              fields.BUILT_WITHOUT_BOX.errorText() ||
              fields.BUILT_PIECES_LOST.errorText()}
          </FormError>
        )}
        <Button type="submit" className="mt-14 w-64">
          Save
        </Button>
      </div>
    </form>
  );
};
