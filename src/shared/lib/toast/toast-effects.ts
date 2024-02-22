import { createEffect } from 'effector';
import { toast, ToastOptions } from 'react-toastify';

type Option = {
  title: string;
  option?: ToastOptions;
};

export const showSuccessToastFx = createEffect({
  handler({ title, option }: Option) {
    toast.success(title, option);
  },
});

export const showErrorToastFx = createEffect({
  handler({ title, option }: Option) {
    toast.error(title, option);
  },
});
