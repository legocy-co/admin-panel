import { createForm } from 'effector-forms';
import { attach, createEvent, sample } from 'effector';
import { z } from 'zod';
import { createGate } from 'effector-react';
import { createRule } from '../../services/utils.ts';
import { authService } from '../../services/AuthService.ts';

export const gate = createGate();

export const signedIn = createEvent();

export const form = createForm({
  fields: {
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
    password: {
      init: '',
      rules: [
        createRule({
          name: 'password',
          schema: z.string().trim().min(1, 'Missing password'),
        }),
      ],
    },
  },
});

// AuthService
const signInFx = attach({
  source: form.$values,
  effect: (values) =>
    authService.SignIn({
      email: values.email,
      password: values.password,
    }),
});

sample({
  clock: form.formValidated,
  target: signInFx,
});

sample({
  clock: signInFx.done,
  target: signedIn,
});

sample({
  clock: gate.close,
  target: form.reset,
});
