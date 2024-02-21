import {
  type SortingState,
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  Header,
  type Table as TableType,
  Column,
  ColumnOrderState,
  ColumnResizeMode,
  VisibilityState,
  ColumnSizingState,
} from '@tanstack/react-table';
import React, { useState } from 'react';
import { clsx } from 'clsx';
import ArrowDownIcon from '../../icons/arrow-down.svg';
import EnlargeIcon from '../../icons/enlarge.svg';
import { useDrag, useDrop } from 'react-dnd';
import './index.scss';
import FilterIcon from '../../icons/filter.svg';

type Props<T> = {
  data: T[];
  columns: ColumnDef<T, any>[];
  columnOrder?: string[];
  setColumnOrder?: React.Dispatch<React.SetStateAction<string[]>>;
  columnVisibility?: VisibilityState;
  setColumnVisibility?: React.Dispatch<React.SetStateAction<VisibilityState>>;
  columnSizing?: ColumnSizingState;
  setColumnSizing?: React.Dispatch<React.SetStateAction<ColumnSizingState>>;
  sorting?: SortingState;
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>;
  onRowClick?: (arg: T) => void;
  isSortable?: boolean;
};

export const Table = <T,>({
  columns,
  data,
  isSortable = true,
  onRowClick,
  columnOrder,
  setColumnOrder,
  columnVisibility,
  setColumnVisibility,
  columnSizing,
  setColumnSizing,
  sorting,
  setSorting,
}: Props<T>) => {
  const [columnResizeMode] = useState<ColumnResizeMode>('onEnd');
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      columnOrder,
      columnVisibility,
      columnSizing,
    },
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto flex">
      <table
        style={{
          width: table.getCenterTotalSize(),
        }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <DraggableColumnHeader
                  {...{
                    colSpan: header.colSpan,
                    style: {
                      width: header.getSize(),
                    },
                    key: header.id,
                  }}
                  header={header}
                  table={table}
                  isSortable={isSortable}
                  columnResizeMode={columnResizeMode}
                />
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              aria-hidden={!!onRowClick}
              onClick={() =>
                onRowClick ? onRowClick(row.original) : undefined
              }
              className={clsx('odd:bg-black odd:bg-opacity-5', {
                'cursor-pointer hover:bg-black hover:bg-opacity-10':
                  !!onRowClick,
              })}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  {...{
                    key: cell.id,
                    style: {
                      width: cell.column.getSize(),
                    },
                  }}
                  className="px-4 py-3 text-left overflow-hidden"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

type HeaderProps<T> = {
  header: Header<T, unknown>;
  table: TableType<T>;
  isSortable?: boolean;
  columnResizeMode: ColumnResizeMode;
  colSpan?: number;
  style?: React.CSSProperties;
};

const DraggableColumnHeader = <T,>({
  header,
  table,
  isSortable = false,
  columnResizeMode,
  style,
  colSpan,
}: HeaderProps<T>) => {
  const { getState, setColumnOrder } = table;
  const { columnOrder } = getState();
  const { column } = header;

  const [{ isOver }, dropRef] = useDrop({
    accept: 'column',
    drop: (draggedColumn: Column<T>) => {
      const newColumnOrder = reorderColumn(
        draggedColumn.id,
        column.id,
        columnOrder
      );
      setColumnOrder(newColumnOrder);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ opacity, isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: 'column',
  });

  const meta = (header.column.columnDef.meta as any) ?? {};

  return (
    <th
      ref={dropRef}
      className="relative align-middle"
      style={{
        ...style,
        opacity,
      }}
      colSpan={colSpan}
    >
      <div
        ref={previewRef}
        className={clsx('group/sort', {
          'cursor-grab': !isDragging,
          'cursor-grabbing': isDragging,
        })}
      >
        <div
          ref={dragRef}
          className={clsx(
            'text-left px-4 py-3 transition-all text-sm font-medium select-none space-x-1 flex items-baseline hover:bg-black hover:bg-opacity-10',
            {
              'bg-neutral-60': isOver,
            }
          )}
        >
          <span>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </span>
          {isSortable && header.column.getCanSort() && (
            <button
              {...(isSortable
                ? {
                    onClick: header.column.getToggleSortingHandler(),
                  }
                : {})}
              className="w-5 h-5"
            >
              <img
                src={ArrowDownIcon}
                alt=""
                className={clsx(
                  'flex-shrink-0 transition-all hover:opacity-90 active:opacity-80',
                  {
                    'rotate-180 [&>path]:stroke-primary-default':
                      header.column.getIsSorted() === 'asc',
                    'rotate-0 [&>path]:stroke-primary-default':
                      header.column.getIsSorted() === 'desc',
                    '[&>path]:stroke-neutral-50 opacity-0 group-hover/sort:opacity-100':
                      !header.column.getIsSorted(),
                  }
                )}
              />
            </button>
          )}
          {meta.onClickFilter && (
            <button
              onClick={meta.onClickFilter}
              className="w-5 h-5 bg-legocy opacity-0 group-hover/sort:opacity-100"
            >
              <img src={FilterIcon} alt="" />
            </button>
          )}
        </div>
      </div>
      <div
        {...{
          onMouseDown: header.getResizeHandler(),
          onTouchStart: header.getResizeHandler(),
          className: `resizer ${
            header.column.getIsResizing() ? 'isResizing' : ''
          }`,
          style: {
            transform:
              columnResizeMode === 'onEnd' && header.column.getIsResizing()
                ? `translateX(${
                    table.getState().columnSizingInfo.deltaOffset
                  }px)`
                : '',
          },
        }}
      >
        <img
          src={EnlargeIcon}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          alt=""
        />
      </div>
    </th>
  );
};

function reorderColumn(
  draggedColumnId: string,
  targetColumnId: string,
  columnOrder: string[]
): ColumnOrderState {
  const copy = [...columnOrder];
  copy.splice(
    copy.indexOf(targetColumnId),
    0,
    copy.splice(copy.indexOf(draggedColumnId), 1)[0] as string
  );
  return copy;
}
