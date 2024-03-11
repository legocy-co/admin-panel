import { forwardRef, ReactNode } from 'react';
import BackIcon from '../icons/back.svg';
import { addDefaultSrc } from '../../services/utils.ts';
import { useNavigate } from 'react-router-dom';
import { MenuButton } from './menu-button.tsx';

type PageHeadingProps = {
  children?: ReactNode;
  to?: string;
  isMarketItemDetail?: boolean;
};

export const PageHeading = forwardRef<HTMLDivElement, PageHeadingProps>(
  ({ children, to = '/', isMarketItemDetail = false }, ref) => {
    const navigate = useNavigate();

    return (
      <div
        className="relative w-2/3 h-12 flex justify-center items-center mb-7"
        ref={ref}
      >
        <img
          src={BackIcon}
          onError={addDefaultSrc}
          className="max-lg:hidden lg:absolute left-0 hover:opacity-90 transition-opacity active:opacity-80 cursor-pointer"
          onClick={() => navigate(to)}
          alt=""
        />
        <div className="flex justify-center gap-5 text-2xl sm:text-bh font-bold text-nowrap">
          {children}
        </div>
        {isMarketItemDetail && (
          <MenuButton className="absolute right-0" isCurrency />
        )}
      </div>
    );
  }
);

PageHeading.displayName = 'PageHeading';
