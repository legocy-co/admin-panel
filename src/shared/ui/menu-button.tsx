import { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';
import ExpandIcon from '../icons/expand.svg';

type MenuButtonProps = {
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  isCurrency?: boolean;
  disabled?: boolean;
  isInvalid?: boolean;
};

export const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  (
    { onClick, children, className, isCurrency = false, disabled, isInvalid },
    ref
  ) => {
    return (
      <button
        className={clsx(
          className,
          'py-3 px-6 rounded-full  border border-solid border-graphite text-nowrap font-medium transition-all hover:brightness-95 active:brightness-90',
          { 'flex justify-between items-center min-w-32 px-4': isCurrency },
          { 'brightness-75 pointer-events-none': disabled },
          { 'bg-white dark:bg-dark': !isInvalid },
          { 'bg-rose text-black': isInvalid }
        )}
        ref={ref}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
        {isCurrency && (
          <>
            <p>USD $</p>
            <img src={ExpandIcon} alt="" />
          </>
        )}
      </button>
    );
  }
);

MenuButton.displayName = 'MenuButton';
