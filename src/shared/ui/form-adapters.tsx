import { Field, useField } from 'effector-forms';
import { Input, InputProps } from './input';
import React, { useState } from 'react';
import { SelectSearch, SelectSearchOption } from './select-search.tsx';

export type FormAdapterProps<T> = {
  field: Field<T>;
} & Omit<InputProps, 'isInvalid'>;

export const TextFieldAdapter = ({
  field,
  ...props
}: FormAdapterProps<string>) => {
  const { value, onChange, hasError } = useField(field);

  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      isInvalid={hasError()}
      {...props}
    />
  );
};

export const NumberFieldAdapter = ({
  field,
  ...props
}: FormAdapterProps<number>) => {
  const { value, onChange, hasError } = useField(field);

  return (
    <Input
      type="number"
      value={value ?? ''}
      onChange={handleNumberFieldChange(onChange)}
      isInvalid={hasError()}
      {...props}
    />
  );
};

export const SelectSearchAdapter = ({
  field,
  labelText,
  options,
  clientSideSearch,
  ...props
}: FormAdapterProps<string> & {
  options: SelectSearchOption[];
  clientSideSearch?: boolean;
}) => {
  const { onChange, hasError, value: activeValue } = useField(field);
  const [value, setValue] = useState('');
  const foundValue = options.find((option) => option.value === activeValue);
  const inputValue = foundValue ? foundValue.label : value;

  function handleReset() {
    field.reset();
    setValue('');
  }

  return (
    <div className="relative">
      <SelectSearch
        {...props}
        clientSideSearch={clientSideSearch}
        labelText={labelText}
        onChange={(option) => {
          onChange(option.value);
        }}
        onInputChange={(search) => setValue(search)}
        value={inputValue}
        isInvalid={hasError()}
        isDisabled={inputValue === foundValue?.label}
        options={options}
        activeValue={activeValue}
      />
      <div
        className="absolute top-8 right-4 cursor-pointer"
        onClick={handleReset}
      >
        x
      </div>
    </div>
  );
};

function handleNumberFieldChange(onChange: (value: number) => void) {
  return (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.target;
    value === '' || isNaN(+value)
      ? onChange(null as unknown as number)
      : onChange(+value);
  };
}
