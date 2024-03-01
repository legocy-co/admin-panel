import { Field, useField } from 'effector-forms';
import { Input, InputProps } from './input';
import React, { useState } from 'react';
import { SelectSearch, SelectSearchOption } from './select-search.tsx';
import { Textarea } from './textarea.tsx';
import clsx from 'clsx';

export type FormAdapterProps<T> = {
  field: Field<T>;
} & Omit<InputProps, 'isInvalid'>;

export type SelectFieldOption = {
  value: string;
  label: string;
};

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

export const TextareaFieldAdapter = ({
  field,
  className,
  labelText,
}: FormAdapterProps<string>) => {
  const { value, onChange } = useField(field);

  return (
    <Textarea
      labelText={labelText}
      className={className}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
};

export const SelectFieldAdapter = ({
  field,
  defaultOptionValue,
  options,
  disabled,
}: {
  options: SelectFieldOption[];
  defaultOptionValue: string;
  field: Field<any>;
  disabled?: boolean;
}) => {
  const { value, onChange, hasError } = useField(field);

  const isInvalid = hasError();

  return (
    <select
      value={value ?? defaultOptionValue}
      disabled={disabled}
      onChange={(ev) => onChange(ev.currentTarget.value)}
      className={clsx(
        'block w-[343px] h-[44px] bg-dark border border-solid border-slate rounded-xl indent-3 pr-10 outline-0 mb-3.5',
        { 'bg-rose text-charcoal': isInvalid }
      )}
    >
      {options.map(({ value, label }, i) => (
        <option key={value + i} value={value} className="">
          {label}
        </option>
      ))}
    </select>
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
