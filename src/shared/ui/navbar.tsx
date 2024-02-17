import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';

import { IconType } from '../icons';
import Logo from '../../../public/logo.svg?react';
import LogoutIcon from '../icons/logout.svg?react';

type TNavigationItem = {
  to: string;
  name: string;
  Icon: IconType;
};

export const Navbar = () => {
  return (
    <nav className="h-full fixed flex justify-between flex-col w-40 bg-white bg-opacity-5 px-2 pt-6 pb-2 overflow-auto">
      <NavigationItem to="/" Icon={Logo} name="root" />
      {/*<img src="/logo.svg" alt="" className="mx-auto mb-12 flex-shrink-0" />*/}
      {/*<div className="flex-grow flex flex-col space-y-3">*/}
      {/*  {navigationItemsGroups.map((item) => (*/}
      {/*    <NavigationItemsGroup key={item.name} {...item} />*/}
      {/*  ))}*/}
      {/*</div>*/}
      <div className="w-full flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <NavigationItem to="/sign-in" Icon={LogoutIcon} name="Log out" />
        </div>
      </div>
    </nav>
  );
};

const NavigationItem = ({ to, name, Icon }: TNavigationItem) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'w-full flex items-center space-x-2 px-2 py-3 rounded-lg transition-all group',
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
            className={clsx('-translate-y-[1px] w-1/2', {
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
