import { createEvent, createStore, sample } from 'effector';
import { Location, NavigateFunction } from 'react-router-dom';

export const locationChanged = createEvent<Location>();
export const navigateChanged = createEvent<NavigateFunction>();

export const $location = createStore<null | Location>(null);
export const $navigate = createStore<null | NavigateFunction>(null);

sample({
  clock: locationChanged,
  target: $location,
});

sample({
  clock: navigateChanged,
  target: $navigate,
});
