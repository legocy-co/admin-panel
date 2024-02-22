import { createApi, createEvent, createStore } from 'effector';

type Props = {
  defaultIsOpen?: boolean;
};

export function createDisclosure(options: Props = {}) {
  const { defaultIsOpen = false } = options;
  const $isOpen = createStore(defaultIsOpen);
  const { open, close } = createApi($isOpen, {
    open: () => true,
    close: () => false,
  });

  const toggle = createEvent();
  $isOpen.on(toggle, (isOpen) => !isOpen);

  return {
    $isOpen,
    open,
    close,
    toggle,
  };
}
