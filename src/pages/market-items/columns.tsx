import { createColumnHelper } from '@tanstack/table-core';
import * as lib from './lib';
import { Button } from '../../shared/ui/button.tsx';
import { dmi } from '../../features/market-item/delete/index.tsx';

const columnHelper = createColumnHelper<lib.MarketItemRow>();

export const useColumns = () => {
  return [
    columnHelper.accessor('price', {
      header: () => 'Price',
      cell: (info) => <span>{info.getValue()}</span>,
      id: 'price',
      size: 200,
      meta: {
        title: 'Price',
      },
    }),

    columnHelper.accessor('location', {
      header: () => 'Location',
      cell: (info) => <span>{info.getValue()}</span>,
      id: 'location',
      size: 400,
      meta: {
        title: 'Location',
      },
    }),

    columnHelper.accessor('lego_set_name', {
      header: () => 'Set',
      cell: (info) => <span>{info.getValue()}</span>,
      id: 'lego_set_name',
      size: 400,
      meta: {
        title: 'Set',
      },
    }),

    columnHelper.accessor('seller_username', {
      header: () => 'Seller',
      cell: (info) => <span>{info.getValue()}</span>,
      id: 'seller_username',
      size: 200,
      meta: {
        title: 'Seller',
      },
    }),

    columnHelper.accessor('status', {
      header: () => 'Status',
      cell: (info) => <span>{info.getValue()}</span>,
      id: 'status',
      size: 200,
      meta: {
        title: 'Status',
      },
    }),

    columnHelper.accessor('set_state', {
      header: () => 'State',
      cell: (info) => <span>{info.getValue()}</span>,
      id: 'set_state',
      size: 200,
      meta: {
        title: 'State',
      },
    }),

    columnHelper.display({
      id: 'actions',
      cell: (info) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Button
            className="w-8 h-8 bg-red-100 hover:bg-red-200 active:bg-red-300 rounded-full"
            onClick={() =>
              dmi.deleteTriggered({
                id: info.row.original.id,
                name: info.row.original.lego_set_name,
              })
            }
          >
            x
          </Button>
        </div>
      ),
    }),
  ];
};
