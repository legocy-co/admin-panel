import { attach, createEvent, createStore, sample } from 'effector';
import { Location, NavigateFunction, To } from 'react-router-dom';

export const locationChanged = createEvent<Location>();
export const navigateChanged = createEvent<NavigateFunction>();

export const $location = createStore<null | Location>(null);
export const $navigate = createStore<null | NavigateFunction>(null);

export const navigateFx = attach({
  source: $navigate,
  effect: (navigate, to: To) => {
    if (navigate) {
      navigate(to);
    }
  },
});

sample({
  clock: locationChanged,
  target: $location,
});

sample({
  clock: navigateChanged,
  target: $navigate,
});
