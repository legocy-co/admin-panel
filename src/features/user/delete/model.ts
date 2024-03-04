import { createDisclosure } from '../../../shared/lib/disclosure.ts';
import { createEffect, createEvent, restore, sample } from 'effector';
import { userService } from '../../../services/UserService.ts';
export const disclosure = createDisclosure();

export const deleteTriggered = createEvent<{ id: number; username: string }>();

export const deleteUser = createEvent();
export const deleted = createEvent<number>();

export const $username = restore(
  deleteTriggered.map((user) => user.username),
  ''
);

const deleteFx = createEffect(userService.DeleteUser);

sample({
  clock: deleteTriggered,
  target: disclosure.open,
});

sample({
  clock: deleteUser,
  source: deleteTriggered,
  fn: ({ id }) => id,
  target: deleteFx,
});

sample({
  clock: deleteFx.done,
  fn: ({ params }) => +params,
  target: [disclosure.close, deleted],
});
