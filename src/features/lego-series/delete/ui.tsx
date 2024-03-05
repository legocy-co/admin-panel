import { useUnit } from 'effector-react';
import * as model from './model.ts';
import { Modal } from '../../../shared/ui/modal.tsx';
import { Button } from '../../../shared/ui/button.tsx';

export const DeleteLegoSeries = () => {
  const [isOpen, name] = useUnit([
    model.disclosure.$isOpen,
    model.$legoSeriesName,
  ]);
  return (
    <Modal
      open={isOpen}
      onClose={() => model.disclosure.close()}
      className="max-w-md"
      title="Delete lego seriea"
    >
      <p className="mb-5">
        Do you really want to delete lego series{' '}
        <b className="font-medium">{name}</b>?
      </p>
      <div className="flex gap-2">
        <Button onClick={() => model.disclosure.close()}>Cancel</Button>
        <Button onClick={() => model.deleteLegoSeries()}>Delete</Button>
      </div>
    </Modal>
  );
};
