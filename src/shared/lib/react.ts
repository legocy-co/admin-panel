import { SetStateAction } from 'react';

export const mapSetState = <T>(updaterOrUpdate: SetStateAction<T>) => {
  return ({
    prevState,
    update,
  }: {
    prevState: T;
    update: (state: T) => void;
  }) => {
    if (typeof updaterOrUpdate === 'function') {
      update((updaterOrUpdate as (prevState: T) => T)(prevState));
    } else {
      update(updaterOrUpdate);
    }
  };
};
