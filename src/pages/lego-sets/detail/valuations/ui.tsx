import { useGate, useUnit } from 'effector-react';
import * as model from './model.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { setStates } from '../../../../types/MarketItemType.ts';
import { ValuationForm } from '../../../../features/valuation';

export const LegoSetDetailValuations = () => {
  const params = useParams<'id'>();
  const navigate = useNavigate();
  const detailValuations = useUnit(model.$detailValuations);

  useGate(model.gate, { id: params.id ?? null, navigate });

  const valuationsElement = Object.keys(setStates).map((state) => (
    <div key={'valuation-' + state} className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <p className="font-normal">
          {setStates[state as keyof typeof setStates]}
        </p>
      </div>
      <div className="text-2xl">
        {detailValuations.find((valuation) => valuation.state === state) ? (
          detailValuations.find((valuation) => valuation.state === state)
            ?.valuation + ' $'
        ) : (
          <ValuationForm
            lego_set_id={params.id ?? null}
            state={state}
            id={'form-' + state}
          />
        )}
      </div>
    </div>
  ));

  return (
    <div className="w-3/4">
      <p className="text-3xl font-black text-start">
        Lego set&apos;s valuations
      </p>
      <div className="grid grid-flow-col gap-10 grid-rows-3 mt-7 transition-all">
        {valuationsElement}
      </div>
    </div>
  );
};
