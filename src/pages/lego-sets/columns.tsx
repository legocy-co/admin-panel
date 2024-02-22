import { createColumnHelper } from '@tanstack/table-core';
import * as lib from './lib';
import { Button } from '../../shared/ui/button.tsx';
import { legoSetService } from '../../services/LegoSetService.ts';

const columnHelper = createColumnHelper<lib.SetRow>();

export const useColumns = () => {
  return [
    columnHelper.accessor('number', {
      header: () => 'Set number',
      cell: (info) => <span>{info.getValue()}</span>,
      id: 'number',
      size: 200,
      meta: {
        title: 'Set number',
      },
    }),

    columnHelper.accessor('name', {
      header: () => 'Set',
      cell: (info) => <span>{info.getValue()}</span>,
      id: 'name',
      size: 400,
      meta: {
        title: 'Set',
      },
    }),

    columnHelper.accessor('pieces', {
      header: () => 'Pieces',
      cell: (info) => <span>{info.getValue()}</span>,
      id: 'pieces',
      size: 200,
      meta: {
        title: 'Pieces',
      },
    }),

    columnHelper.accessor('series', {
      header: () => 'Series',
      cell: (info) => <span>{info.getValue()}</span>,
      id: 'series',
      size: 400,
      meta: {
        title: 'Series',
      },
    }),

    columnHelper.display({
      id: 'actions',
      cell: (info) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Button
            className="w-8 h-8 bg-red-200 hover:bg-red-300 active:bg-red-400 rounded-full"
            onClick={
              () => legoSetService.DeleteLegoSet(info.row.original.id)
              // dls.deleteTriggered({
              //   id: info.row.original.id,
              //   name: info.row.original.name,
              // })
              //TODO: confirmation modal
            }
          >
            x
          </Button>
        </div>
      ),
    }),
  ];
};
