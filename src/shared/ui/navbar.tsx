import { clsx } from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';
import * as Collapsible from '@radix-ui/react-collapsible';
import { IconType } from '../icons';
import { useStoreMap } from 'effector-react';
import { createEvent, createStore } from 'effector';
import { persist } from 'effector-storage/local';

import LogoutIcon from '../icons/logout.svg?react';
import SetsIcon from '../icons/box.svg?react';
import MarketItemsIcon from '../icons/cart.svg?react';
import UsersIcon from '../icons/user.svg?react';
import AdminIcon from '../icons/admin.svg?react';
import SeriesIcon from '../icons/series.svg?react';

import ChevronLeftIcon from '../icons/chevron-left.svg?react';

type TNavigationItem = {
  to: string;
  name: string;
  Icon: IconType;
};

type TNavigationItemsGroup = {
  name: string;
  items: TNavigationItem[];
};

const navigationItemsGroups: TNavigationItemsGroup[] = [
  {
    name: 'wiki',
    items: [
      {
        to: '/wiki/sets',
        Icon: SetsIcon,
        name: 'Sets',
      },
      {
        to: '/wiki/series',
        Icon: SeriesIcon,
        name: 'Series',
      },
    ],
  },
  {
    name: 'market items',
    items: [
      {
        to: '/market-items',
        Icon: MarketItemsIcon,
        name: 'Market items',
      },
    ],
  },
  {
    name: 'users',
    items: [
      {
        to: '/users',
        Icon: UsersIcon,
        name: 'Users',
      },
      {
        to: '/register-admin',
        Icon: AdminIcon,
        name: 'Register admin',
      },
    ],
  },
];

const LS_KEY = 'openedGroups';

const initiallyOpenedGroups = ['wiki'];

const openedGroupToggled = createEvent<string>();

const $openedGroups = createStore(initiallyOpenedGroups);

$openedGroups.on(openedGroupToggled, (state, group) => {
  if (state.includes(group)) {
    return state.filter((item) => item !== group);
  }

  return [...state, group];
});

persist({
  key: LS_KEY,
  store: $openedGroups,
});

export const Navbar = (props: { isHidden: boolean }) => {
  return (
    <nav
      className={clsx(
        'h-screen flex justify-between flex-col w-40 bg-white bg-opacity-5 px-2 pt-6 pb-2 overflow-auto',
        { hidden: props.isHidden }
      )}
    >
      <img src="/logo.svg" alt="" className="mx-auto mb-12 flex-shrink-0" />
      <div className="flex-grow flex flex-col space-y-3">
        {navigationItemsGroups.map((item) => (
          <NavigationItemsGroup key={item.name} {...item} />
        ))}
      </div>
      <div className="w-full flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <NavigationItem to="/auth/logout" Icon={LogoutIcon} name="Log out" />
        </div>
      </div>
    </nav>
  );
};

const NavigationItemsGroup = ({ name, items }: TNavigationItemsGroup) => {
  const { pathname } = useLocation();
  const routes = items.map((item) => item.to);
  const forcedOpen = useStoreMap({
    store: $openedGroups,
    keys: [name],
    fn: (openedGroups, [name]) => openedGroups.includes(name),
    defaultValue: true,
  });

  const rootPath = `/${pathname.split('/')[1]}`;

  const open = routes.includes(rootPath) || forcedOpen;

  return (
    <Collapsible.Root
      className="full"
      open={open}
      onOpenChange={() => openedGroupToggled(name)}
    >
      <Collapsible.Trigger asChild>
        <button className="text-left p-2 flex items-center space-x-2 w-full">
          <ChevronLeftIcon
            className={clsx(
              'w-5 h-5 fill-silver transition-all -translate-y-[px] [&>path]:text-neutral-30',
              {
                'rotate-90': open,
                '-rotate-90': !open,
              }
            )}
          />
          <span className="text-sm uppercase text-neutral-30">{name}</span>
        </button>
      </Collapsible.Trigger>
      <Collapsible.Content className="w-full flex flex-col">
        {items.map((item) => (
          <NavigationItem key={item.name} {...item} />
        ))}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

const NavigationItem = ({ to, name, Icon }: TNavigationItem) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'w-full flex items-center space-x-2 px-2 py-3 mb-1 rounded-lg transition-all group',
          {
            'bg-white bg-opacity-5': isActive,
            'hover:bg-white hover:bg-opacity-5': !isActive,
          }
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={clsx('-translate-y-[1px] w-1/2 h-10', {
              '[&>path]:text-primary-default': isActive,
              '[&>path]:group-hover:text-primary-default [&>path]:text-primary-medium':
                !isActive,
            })}
          />
          <p
            className={clsx('text-sm transition-all', {
              'text-white font-medium': isActive,
              'group-hover:text-white text-neutral-30': !isActive,
            })}
          >
            {name}
          </p>
        </>
      )}
    </NavLink>
  );
};
