import { createEffect, createStore } from 'effector';
import { userService } from '../../../services/UserService.ts';
import { User } from '../../../types/UserType.ts';

type UserOption = {
  id: string;
  username: string;
};

export const GetUsersFx = createEffect(() => userService.GetUsers());

export const $userOptions = createStore<UserOption[]>([]);

export function toUserOptions(users: User[]): UserOption[] {
  return users.map((user) => ({
    id: String(user.id),
    username: user.username,
  }));
}
