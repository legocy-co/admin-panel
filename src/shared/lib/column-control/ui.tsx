import * as Popover from '@radix-ui/react-popover';
import { ColumnControlModel } from './model';
import ColumnsIcon from '../../icons/columns.svg';
import DragIcon from '../../icons/drag.svg';
import { useList, useStoreMap, useUnit } from 'effector-react';
import { Toggle } from '../../ui/toggle';
import { useDrag, useDrop } from 'react-dnd';
import clsx from 'clsx';

type Props = {
  model: ColumnControlModel;
};

export const ColumnControl = ({ model }: Props) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={
            'w-10 h-10 transition-opacity hover:opacity-90 active:opacity-80 flex flex-col items-center'
          }
        >
          <img src={ColumnsIcon} className="-translate-y-0.5" alt="" />
          Columns
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          className="w-96 bg-neutral-85 rounded-lg will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade z-10"
          sideOffset={5}
        >
          {useList(model.$columnOrder, (id) => (
            <Column key={id} id={id} model={model} />
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

const Column = ({ model, id }: { id: string; model: ColumnControlModel }) => {
  const title = useStoreMap({
    store: model.$titles,
    keys: [id],
    fn: (titles, [id]) => titles[id],
  });
  const checked = useStoreMap({
    store: model.$visibility,
    keys: [id],
    fn: (visibility, [id]) => visibility[id],
  });
  const hidden = useStoreMap({
    store: model.$hiddenColumns,
    keys: [id],
    fn: (hidden, [id]) => hidden[id],
  });
  const order = useUnit(model.$columnOrder);

  const [{ isOver }, dropRef] = useDrop({
    accept: 'column',
    drop: (item: { id: string }) => {
      const newColumnOrder = reorderColumn(item.id, id, order);

      model.columnOrderChanged(newColumnOrder);
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
    item: () => ({ id }),
    type: 'column',
  });

  if (hidden) {
    return null;
  }

  return (
    <div className="w-full" ref={previewRef}>
      <div
        ref={dropRef}
        className={clsx(
          'w-full bg-legocy text-black flex items-center space-x-2 pl-2 border-b border-solid border-b-black last:border-0 transition-all',
          {
            'bg-neutral-60': isOver,
          }
        )}
        style={{
          opacity,
        }}
      >
        <button
          ref={dragRef}
          className={clsx('w-5 h-5', {
            'cursor-grab': !isDragging,
            'cursor-grabbing': isDragging,
          })}
        >
          <img src={DragIcon} alt="" />
        </button>
        <div className="flex-1 py-4 pr-4 flex items-center justify-between">
          <span>{title}</span>
          <Toggle
            checked={checked}
            onChange={() => model.visibilityChanged(id)}
          />
        </div>
      </div>
    </div>
  );
};

function reorderColumn(
  draggedColumnId: string,
  targetColumnId: string,
  columnOrder: string[]
) {
  const copy = [...columnOrder];

  copy.splice(
    copy.indexOf(targetColumnId),
    0,
    copy.splice(copy.indexOf(draggedColumnId), 1)[0] as string
  );
  return copy;
}
