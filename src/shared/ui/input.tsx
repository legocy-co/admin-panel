import { InputHTMLAttributes, forwardRef, useState } from 'react';
import clsx from 'clsx';

import HideIcon from '../icons/hide.svg';
import ShowIcon from '../icons/show.svg';

type NativeInputProps = InputHTMLAttributes<HTMLInputElement>;

export type InputProps = NativeInputProps & {
  labelText: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  multiple?: boolean;
  className?: string;
  placeholder?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    labelText,
    isInvalid,
    type = 'text',
    isDisabled,
    className,
    placeholder,
    ...rest
  } = props;

  const isPassword = type === 'password';
  const isNumber = type === 'number';

  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const parsedType = getType(type, isPasswordVisible);

  return (
    <>
      <label className="mb-0.5">{labelText}</label>
      <div className="relative">
        <input
          disabled={isDisabled}
          ref={ref}
          className={clsx(
            'block w-[343px] h-[44px] dark:bg-dark border border-solid border-slate rounded-xl !dark:text-charcoal indent-3 pr-10 outline-0 mb-3.5',
            { 'bg-rose dark:bg-rose dark:text-charcoal': isInvalid },
            { 'no-scroll': isNumber },
            className
          )}
          type={parsedType}
          placeholder={placeholder}
          {...rest}
        />
        {isPassword && (
          <img
            className="absolute top-4 right-3 cursor-pointer transition-opacity hover:opacity-90 active:opacity-80"
            onClick={() => setPasswordVisible((prev) => !prev)}
            src={isPasswordVisible ? HideIcon : ShowIcon}
            alt=""
          />
        )}
      </div>
    </>
  );
});

Input.displayName = 'Input';

function getType(type: string, isPasswordVisible: boolean) {
  switch (type) {
    case 'file':
      return 'text';
    case 'password':
      return isPasswordVisible ? 'text' : 'password';
    default:
      return type;
  }
}
