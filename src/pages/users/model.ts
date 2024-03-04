import { createGate } from 'effector-react';
import { createDomain, createEffect, sample } from 'effector';
import { createColumnControlModel } from '../../shared/lib/column-control';
import { columns, toUserRows, UserRow } from './lib.ts';
import { userService } from '../../services/UserService.ts';

export const gate = createGate();

const domain = createDomain();

export const columnControlModel = createColumnControlModel({
  key: 'users',
  columns: columns.map((col) => ({
    id: col.id,
    title: col.title,
    size: col.size,
  })),
});

export const $users = domain.createStore<UserRow[]>([]);

const GetUsersFx = createEffect(() => userService.GetUsers());

sample({
  clock: gate.open,
  filter: gate.status,
  target: GetUsersFx,
});

sample({
  clock: GetUsersFx.doneData,
  fn: toUserRows,
  target: $users,
});

// sample({
//   clock: du.deleted,
//   source: $users,
//   fn: (users: UserRow[], id: number) =>
//     users.filter((user: UserRow) => user.id !== id),
//   target: $users,
// });
