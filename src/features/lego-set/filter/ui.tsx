import * as Popover from '@radix-ui/react-popover';
import { useGate, useUnit } from 'effector-react';
import React from 'react';
import { Button } from '../../../shared/ui/button.tsx';
import {
  NumberFieldAdapter,
  TextFieldAdapter,
} from '../../../shared/ui/form-adapters.tsx';
import { SelectSearch } from '../../../shared/ui/select-search.tsx';
import { FormError } from '../../../shared/ui/form-error.tsx';
import { LegoSetFilterModel } from './model.ts';
import { EventPayload } from 'effector';
import { BsChevronDown } from 'react-icons/bs';
import clsx from 'clsx';

export const LegoSetsFilter = ({ model }: { model: LegoSetFilterModel }) => {
  const { gate, disclosure, form } = model;
  useGate(gate);

  const [isOpen] = useUnit([disclosure.$isOpen]);

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    form.submit();
  };

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          model.cancelTriggered();
        } else {
          model.disclosure.open();
        }
      }}
    >
      <Popover.Trigger asChild>
        <Button className="w-32 max-w-32 h-9 flex items-center justify-around">
          <span className="text-primary text-base">Filters</span>
          <BsChevronDown
            className={clsx('transition-all mt-px -translate-y-[2px]', {
              'rotate-180': isOpen,
            })}
          />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="rounded w-96 text-white p-4 mt-2 bg-slate opacity-90">
          <p className="text-xl">Filters</p>
          <form onSubmit={onSubmit} className="flex flex-col mt-5">
            <TextFieldAdapter
              field={form.fields.name}
              labelText="Lego set name"
            />
            <NumberFieldAdapter
              field={form.fields.min_pieces}
              labelText="Min pieces"
            />
            <NumberFieldAdapter
              field={form.fields.max_pieces}
              labelText="Max pieces"
            />
            {/*<LegoSeriesSearch model={model} />*/}
            {/*TODO: legoSeries filter*/}
            <div className="flex gap-5 justify-center">
              <Button onClick={() => model.cancelTriggered()}>Cancel</Button>
              <Button type="submit">Apply</Button>
            </div>
          </form>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

const LegoSeriesSearch = ({ model }: { model: LegoSetFilterModel }) => {
  const [activeValue, options, value, errorText] = useUnit([
    model.form.fields.series_ids.$value,
    model.$series,
    model.$seriesSearch,
    model.form.fields.series_ids.$errorText,
  ]);

  const hasError = errorText !== '';

  return (
    <div className="relative flex justify-center">
      <SelectSearch
        labelText="Series"
        onChange={(series) => model.seriesSelected(series)}
        onInputChange={(search) => model.seriesSearchChanged(search)}
        value={value}
        isInvalid={hasError}
        options={options}
        activeValue={activeValue?.toString()}
      />
      {hasError && <FormError>{errorText}</FormError>}
    </div>
  );
};

export const ActiveFilters = ({ model }: { model: LegoSetFilterModel }) => {
  const { $activeFilters, resetExactFilterTriggered, resetTriggered } = model;
  const activeFilters = useUnit($activeFilters);

  const count = activeFilters.length;

  if (count === 0) {
    return null;
  }

  return (
    <div className="w-full flex text-xs sm:text-sm items-center justify-between space-x-5 mb-5 border-b border-b-gray-600 border-solid py-2">
      <div className="grid md:flex items-center gap-2">
        {activeFilters.map(([name, value]) => (
          <div
            key={name}
            className="w-max flex rounded-full items-center space-x-2 px-2 py-1.5 bg-slate"
          >
            <button
              type="button"
              onClick={() =>
                resetExactFilterTriggered(
                  name as EventPayload<typeof resetExactFilterTriggered>
                )
              }
              className="rounded-full py-1 px-2 bg-slate hover:brightness-90 active:brightness-80 transition-all"
            >
              x
            </button>
            <div className="text-neutral-30 text-sm flex space-x-1">
              <span className="capitalize">{name.replace('_', ' ')}</span>
              <span>|</span>
              <span className="!text-white max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                {value}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => resetTriggered()}
        type="button"
        className="rounded text-sm p-2 text-black bg-ghost hover:opacity-90 active:opacity-80 transition-opacity"
      >
        Clear filters
      </button>
    </div>
  );
};
