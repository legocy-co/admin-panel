import { createColumnHelper } from '@tanstack/table-core';
import * as lib from './lib.ts';

const columnHelper = createColumnHelper<lib.SeriesRow>();

export const useColumns = () => {
  return [
    columnHelper.accessor('name', {
      header: () => 'Series',
      cell: (info) => <span>{info.getValue()}</span>,
      id: 'name',
      size: 400,
      meta: {
        title: 'Series',
      },
    }),

    // columnHelper.display({
    //   id: 'actions',
    //   cell: (info) => (
    //     <div onClick={(e) => e.stopPropagation()}>
    //       <Button
    //         className="w-8 h-8 bg-red-100 hover:bg-red-200 active:bg-red-300 rounded-full"
    //         onClick={() =>
    //           deleteLegoSeries.deleteTriggered({
    //             id: info.row.original.id,
    //             name: info.row.original.name,
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
