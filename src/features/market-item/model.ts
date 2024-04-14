import { createForm } from 'effector-forms';
import { createRule } from '../../services/utils.ts';
import { createGate } from 'effector-react';
import { NavigateFunction } from 'react-router-dom';
import { z } from 'zod';
import { MarketItem, setStates, statuses } from '../../types/MarketItemType.ts';
import { attach, EventPayload, sample, split } from 'effector';
import { marketItemService } from '../../services/MarketItemService.ts';
import {
  $legoSetOptions,
  GetLegoSetsFx,
  toOptions,
} from '../lego-set/options/model.ts';
import {
  $userOptions,
  GetUsersFx,
  toUserOptions,
} from '../user/options/model.ts';

export const gate = createGate<{
  id: string | null;
  navigateFn: NavigateFunction;
}>();

export const form = createForm({
  fields: {
    description: {
      init: '',
    },
    name: {
      init: '',
      rules: [
        createRule({
          name: 'lego_set_id',
          schema: z.string().min(1, 'Missing Lego set'),
        }),
      ],
    },
    country: {
      init: '',
      rules: [
        createRule({
          name: 'country',
          schema: z.string().min(1, 'Missing country'),
        }),
      ],
    },
    city: {
      init: '',
      rules: [
        createRule({
          name: 'city',
          schema: z.string().min(1, 'Missing city'),
        }),
      ],
    },
    price: {
      init: null as unknown as number,
      rules: [
        createRule({
          name: 'price',
          schema: z
            .number()
            .max(999999)
            .nonnegative()
            .nullable()
            .refine((value) => value !== null, 'Missing price'),
        }),
      ],
    },
    seller_id: {
      init: '',
      rules: [
        createRule({
          name: 'seller_id',
          schema: z.string().min(1, 'Missing seller'),
        }),
      ],
    },
    set_state: {
      init: '' as keyof typeof setStates,
      rules: [
        createRule({
          name: 'set_state',
          schema: z.string().min(1, 'Missing state'),
        }),
      ],
    },
    status: {
      init: '' as keyof typeof statuses,
      rules: [
        createRule({
          name: 'set_state',
          schema: z.string().min(1, 'Missing state'),
        }),
      ],
    },
  },
});

const $marketItemId = gate.state.map(({ id }) => id);

const $isEditing = $marketItemId.map((id) => id !== null);

const fetchMarketItemFx = attach({
  source: $marketItemId,
  effect: (id) => {
    if (!id) throw new Error('ID not provided');
    return marketItemService.GetMarketItem(id);
  },
});

const addMarketItemFx = attach({
  source: form.$values,
  effect: (values) =>
    marketItemService.CreateMarketItem({
      description: values.description,
      legoSetID: Number(values.name),
      location: `${values.city}, ${values.country}`,
      price: values.price,
      sellerID: Number(values.seller_id),
      setState: values.set_state,
      status: values.status,
    }),
});

const updateMarketItemFx = attach({
  source: {
    id: $marketItemId,
    data: form.$values,
  },
  effect: ({ id, data }) =>
    marketItemService.UpdateMarketItem(id!, {
      description: data.description,
      legoSetID: Number(data.name),
      location: `${data.city}, ${data.country}`,
      price: data.price,
      sellerID: Number(data.seller_id),
      setState: data.set_state,
      status: data.status,
    }),
});

const listRedirectFx = attach({
  source: gate.state,
  effect: ({ navigateFn }) => navigateFn('/market-items/'),
});

const detailRedirectFx = attach({
  source: [$marketItemId, gate.state],
  effect: ([id, { navigateFn }]) => navigateFn('/market-items/' + id),
});

function toForm(values: MarketItem): EventPayload<typeof form.setForm> {
  const locationSplit = values.location.split(', ');
  return {
    city: locationSplit[0],
    country: locationSplit[1],
    description: values.description,
    name: String(values.legoSet.id),
    price: values.price,
    seller_id: String(values.seller.id),
    set_state: values.setState,
    status: values.status,
  };
}

sample({
  clock: gate.open,
  target: [GetLegoSetsFx, GetUsersFx],
});

sample({
  clock: GetLegoSetsFx.doneData,
  fn: toOptions,
  target: $legoSetOptions,
});

sample({
  clock: GetUsersFx.doneData,
  fn: toUserOptions,
  target: $userOptions,
});

sample({
  clock: $legoSetOptions,
  filter: $isEditing,
  target: fetchMarketItemFx,
});

sample({
  clock: fetchMarketItemFx.doneData,
  fn: toForm,
  target: form.setForm,
});

split({
  source: form.formValidated,
  match: $isEditing.map(String),
  cases: {
    true: updateMarketItemFx,
    false: addMarketItemFx,
  },
});

sample({
  clock: addMarketItemFx.done,
  target: listRedirectFx,
});

sample({
  clock: updateMarketItemFx.done,
  target: detailRedirectFx,
});

sample({
  clock: gate.close,
  target: form.reset,
});
