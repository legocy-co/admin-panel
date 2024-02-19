import { createGate } from 'effector-react';
import { $location, navigateFx } from '../../shared/lib/react-router.ts';
import { attach, sample } from 'effector';
import { authService } from '../../services/AuthService.ts';
import { si } from '../../features/sign-in/index.tsx';

export const Gate = createGate();

const $from = $location.map((location) => getFrom(location?.search ?? null));

const redirectBackFx = attach({
  source: $from,
  effect: (from) => {
    navigateFx({
      pathname: from,
    });
  },
});

sample({
  clock: Gate.open,
  filter: () => authService.IsAuthorized(),
  target: redirectBackFx,
});

sample({
  clock: si.signedIn,
  target: redirectBackFx,
});

sample({
  clock: Gate.close,
  target: si.form.reset,
});

function getFrom(search: string | null) {
  if (!search) return '/';

  const params = new URLSearchParams(search);
  const from = params.get('from');
  return from ?? '/';
}
