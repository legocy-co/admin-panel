import { createGate } from 'effector-react';
import { NavigateFunction } from 'react-router-dom';
import { attach, createStore, sample } from 'effector';
import { userService } from '../../../services/UserService.ts';
import { User } from '../../../types/UserType.ts';

type UserDetail = {
  id: number;
  email: string;
  username: string;
  role: string;
};

export const gate = createGate<{
  id: string | null;
  navigate: NavigateFunction;
}>();

export const $userDetail = createStore<UserDetail>({
  email: '',
  id: 0,
  role: '',
  username: '',
});

const GetUserFx = attach({
  source: gate.state.map(({ id }) => id),
  effect: (id) => {
    if (!id) throw new Error('No id provided');
    return userService.GetUser(id);
  },
});

function toDetail(user: User): UserDetail {
  return {
    email: user.email,
    id: user.id,
    role: user.role ? 'Admin' : 'User',
    username: user.username,
  };
}

sample({
  clock: gate.open,
  target: GetUserFx,
});

sample({
  clock: GetUserFx.doneData,
  fn: toDetail,
  target: $userDetail,
});
