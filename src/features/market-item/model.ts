import { createForm } from 'effector-forms';
import { createRule } from '../../services/utils.ts';
import { createGate } from 'effector-react';
import { NavigateFunction } from 'react-router-dom';
import { z } from 'zod';
import { MarketItem, setStates, statuses } from '../../types/MarketItemType.ts';
import { attach, createDomain, sample, split } from 'effector';
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

const domain = createDomain();

export const setForm = domain.createEvent<MarketItem>();

const $marketItemId = gate.state.map(({ id }) => id);

const $isEditing = $marketItemId.map((id) => id !== null);

// const fetchMarketItemFx = attach({
//   source: $marketItemId,
//   effect: (id) => {
//     if (!id) throw new Error('ID not provided');
//     return marketItemService.GetMarketItem(id);
//   },
// });

const addMarketItemFx = attach({
  source: form.$values,
  effect: (values) =>
    marketItemService.CreateMarketItem({
      seller_id: Number(values.seller_id),
      status: values.status,
      description: values.description,
      lego_set_id: Number(values.name),
      location: `${values.city}, ${values.country}`,
      price: values.price,
      set_state: values.set_state,
    }),
});

// const updateMarketItemFx = attach({
//   source: {
//     id: $marketItemId,
//     data: form.$values,
//   },
//   effect: ({ id, data }) =>
//     legoSetService.UpdateLegoSet(
//       {
//         n_pieces: data.n_pieces,
//         name: data.name,
//         number: data.number,
//         series_id: Number(data.series_id),
//       },
//       id!
//     ),
// });

const listRedirectFx = attach({
  source: gate.state,
  effect: ({ navigateFn }) => navigateFn('/market-items/'),
});

// function toForm(values: LegoSet): EventPayload<typeof form.setForm> {
//   return {
//     n_pieces: values.n_pieces,
//     name: values.name,
//     number: values.number,
//     series_id: String(values.series.id),
//   };
// }

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

// sample({
//   clock: $legoSeriesOptions,
//   filter: $isEditing,
//   target: fetchMarketItemFx,
// });

// sample({
//   clock: fetchMarketItemFx.doneData,
//   target: setForm,
// });
//
// sample({
//   clock: setForm,
//   fn: toForm,
//   target: form.setForm,
// });

split({
  source: form.formValidated,
  match: $isEditing.map(String),
  cases: {
    // true: updateLegoSetFx,
    false: addMarketItemFx,
  },
});

sample({
  clock: [addMarketItemFx.done /*, updateLegoSetFx.done*/],
  target: listRedirectFx,
});

sample({
  clock: gate.close,
  target: form.reset,
});
