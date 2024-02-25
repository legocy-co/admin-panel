import {
  createEvent,
  Store,
  Event,
  attach,
  createEffect,
  sample,
} from 'effector';

const MESSAGE_TYPE = 'ENTITY_FILTER';

export const factory = ({
  $appliableEntities,
  setupListener,
}: {
  $appliableEntities: Store<string[]> | Store<number[]>;
  setupListener: Event<any>;
}) => {
  const entity = cutQueryParams(window.location.pathname.split('/')[1]);
  const cancelClicked = createEvent();

  const applyClicked = createEvent();

  const postMessageFx = attach({
    source: $appliableEntities,
    effect: (entities, action: string) => {
      window.top?.postMessage({
        type: MESSAGE_TYPE,
        entities,
        action,
        entity,
      });
    },
  });

  const messageReceived = createEvent<{
    entities: string[] | number[];
    action: string;
    entity: string;
  }>();

  const applyRecieved = messageReceived.filter({
    fn: (payload) => payload.action === 'apply',
  });

  const messageListenerFx = createEffect(() => {
    window.addEventListener('message', listener);
  });

  function listener(event: MessageEvent<any>) {
    if (event.data.type !== MESSAGE_TYPE) return;
    messageReceived(event.data);
  }

  const removeMessageListenerFx = createEffect(() => {
    window.removeEventListener('message', listener);
  });

  sample({
    clock: applyClicked,
    fn: () => 'apply',
    target: postMessageFx,
  });

  sample({
    clock: cancelClicked,
    fn: () => 'cancel',
    target: postMessageFx,
  });

  sample({
    clock: postMessageFx.done,
    filter: ({ params }) => params === 'cancel',
    target: removeMessageListenerFx,
  });

  sample({
    clock: setupListener,
    target: messageListenerFx,
  });

  return {
    messageReceived,
    applyClicked,
    cancelClicked,
    applyRecieved,
  };
};

function cutQueryParams(url: string) {
  return url.split('?')[0];
}
