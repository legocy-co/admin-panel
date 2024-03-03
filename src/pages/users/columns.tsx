import { createColumnHelper } from '@tanstack/table-core';
import * as lib from './lib';

const columnHelper = createColumnHelper<lib.MarketItemRow>();

export const useColumns = () => {
  return [
    columnHelper.accessor('role', {
      header: () => 'Role',
      cell: (info) => <span>{info.getValue()}</span>,
      id: 'role',
      size: 200,
      meta: {
        title: 'Role',
      },
    }),

    columnHelper.accessor('email', {
      header: () => 'Email',
      cell: (info) => <span>{info.getValue()}</span>,
      id: 'email',
      size: 400,
      meta: {
        title: 'Email',
      },
    }),

    columnHelper.accessor('username', {
      header: () => 'Username',
      cell: (info) => <span>{info.getValue()}</span>,
      id: 'username',
      size: 400,
      meta: {
        title: 'Username',
      },
    }),

    // columnHelper.display({
    //   id: 'actions',
    //   cell: (info) => (
    //     <div onClick={(e) => e.stopPropagation()}>
    //       <Button
    //         className="w-8 h-8 bg-red-100 hover:bg-red-200 active:bg-red-300 rounded-full"
    //         onClick={() =>
    //           du.deleteTriggered({
    //             id: info.row.original.id,
    //             name: info.row.original.lego_set_name,
    //           })
    //         }
    //       >
    //         x
    //       </Button>
    //     </div>
    //   ),
    // }),
  ];
};
