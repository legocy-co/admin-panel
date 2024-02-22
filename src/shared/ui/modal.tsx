import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import React from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  className?: string;
  RightNode?: React.ReactNode;
};

export const Modal = ({
  children,
  onClose,
  open,
  title,
  className = '',
}: Props) => {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => (open ? undefined : onClose())}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black bg-opacity-60 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content
          className={clsx(
            className,
            'data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-md bg-neutral-85 p-6 focus:outline-none z-50'
          )}
        >
          <Dialog.Title asChild>
            <p className="text-xl mb-8">{title}</p>
          </Dialog.Title>

          {children}
          <Dialog.Close asChild>
            <button
              className="absolute top-2.5 right-2.5 inline-flex h-6 w-6 appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              x
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
