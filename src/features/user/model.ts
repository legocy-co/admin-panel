import { createGate } from 'effector-react';
import { NavigateFunction } from 'react-router-dom';
import { createForm } from 'effector-forms';
import { createRule } from '../../services/utils.ts';
import { z } from 'zod';
import { attach, EventPayload, sample } from 'effector';
import { userService } from '../../services/UserService.ts';
import { User } from '../../types/UserType.ts';

export const gate = createGate<{
  id: string | null;
  navigateFn: NavigateFunction;
}>();

export const form = createForm({
  fields: {
    username: {
      init: '',
      rules: [
        createRule({
          name: 'username',
          schema: z.string().trim().min(1, 'Missing username'),
        }),
      ],
    },
    email: {
      init: '',
      rules: [
        createRule({
          name: 'email',
          schema: z
            .string()
            .trim()
            .min(1, 'Missing email')
            .email('Invalid email'),
        }),
      ],
    },
    role: {
      init: '',
      rules: [
        createRule({
          name: 'role',
          schema: z.string().min(1, 'Missing role'),
        }),
      ],
    },
  },
});

const $uid = gate.state.map(({ id }) => id);

const fetchUserFx = attach({
  source: $uid,
  effect: (id) => {
    if (!id) throw new Error('ID not provided');
    return userService.GetUser(id);
  },
});

const updateUserFx = attach({
  source: {
    id: $uid,
    data: form.$values,
  },
  effect: ({ id, data }) =>
    userService.UpdateUser(id!, {
      email: data.email,
      role: Number(data.role),
      username: data.username,
    }),
});

const detailRedirectFx = attach({
  source: [gate.state, $uid],
  effect: ([{ navigateFn }, id]) => navigateFn('/users/' + id),
});

function toForm(values: User): EventPayload<typeof form.setForm> {
  return {
    email: values.email,
    role: String(values.role),
    username: values.username,
  };
}

sample({
  clock: gate.open,
  target: fetchUserFx,
});

sample({
  clock: fetchUserFx.doneData,
  fn: toForm,
  target: form.setForm,
});

sample({
  source: form.formValidated,
  target: updateUserFx,
});

sample({
  clock: updateUserFx.done,
  target: detailRedirectFx,
});

sample({
  clock: gate.close,
  target: form.reset,
});
