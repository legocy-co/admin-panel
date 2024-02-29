import * as Popover from '@radix-ui/react-popover';
import { useGate, useUnit } from 'effector-react';
import React from 'react';
import { Button } from '../../../shared/ui/button.tsx';
import {
  NumberFieldAdapter,
  TextFieldAdapter,
} from '../../../shared/ui/form-adapters.tsx';
import { LegoSetFilterModel, SearchModel } from './model.ts';
import { EventPayload } from 'effector';
import { BsChevronDown } from 'react-icons/bs';
import clsx from 'clsx';
import { SelectSearch } from '../../../shared/ui/select-search.tsx';

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
        <Popover.Content className="rounded w-96 text-white p-4 mt-2 bg-slate">
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
            <LegoSeriesSearch
              label="Lego series"
              model={model.seriesListSearch}
            />
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

const LegoSeriesSearch = ({
  model,
  label,
}: {
  model: SearchModel;
  label: string;
}) => {
  const [options, value, selectedWithNames] = useUnit([
    model.$filteredOptions,
    model.$search,
    model.$selectedWithNames,
  ]);

  return (
    <div className="border-black border border-solid dark:bg-dark dark:border-none rounded-xl pt-2 pl-2 mb-5 flex flex-col justify-end">
      <div className="flex flex-wrap gap-1 top-0">
        {selectedWithNames.map((selected) => (
          <div
            key={selected.id}
            aria-hidden
            onClick={() => model.removed(selected.id)}
            className="bg-slate text-white w-max rounded-full px-1.5 mb-1 py-0.5 cursor-pointer hover:brightness-90 active:brightness-80 transition-colors"
          >
            <span className="text-sm">{selected.name}</span>
          </div>
        ))}
      </div>
      <SelectSearch
        clientSideSearch
        labelText=""
        onChange={(option) => {
          model.selected(option);
        }}
        onInputChange={(search) => {
          model.searchChanged(search);
        }}
        value={value}
        options={options}
        placeholder={label}
        className="border-none max-w-80 w-80"
      />
    </div>
  );
};

export const ActiveFilters = ({ model }: { model: LegoSetFilterModel }) => {
  const { $activeFilters, resetExactFilterTriggered, resetTriggered } = model;
  const activeFilters = useUnit($activeFilters);

  let count = 0;
  for (let i = 0; i < activeFilters.length; i++)
    activeFilters[i][1]['value'] && count++;

  if (!count) {
    return null;
  }

  return (
    <div className="w-full flex items-center justify-between space-x-5 mb-5 border-b border-b-gray-600 border-solid py-2">
      <div className="grid md:flex items-center gap-2">
        {activeFilters.map(
          ([name, value]) =>
            value.value && (
              <div
                key={name}
                className="w-max flex rounded-full items-center space-x-2 px-2 py-1.5 bg-dark"
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
                  <span className="capitalize">{value.label}</span>
                  <span>|</span>
                  <span className="!text-white">{value.value}</span>
                </div>
              </div>
            )
        )}
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
