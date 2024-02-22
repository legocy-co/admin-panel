import { useUnit } from 'effector-react';

import * as model from './model.ts';
import { Button } from '../../../shared/ui/button.tsx';
import { Modal } from '../../../shared/ui/modal.tsx';

export const DeleteLegoSet = () => {
  const [isOpen, name] = useUnit([
    model.disclosure.$isOpen,
    model.$legoSetName,
  ]);
  return (
    <Modal
      open={isOpen}
      onClose={() => model.disclosure.close()}
      className="max-w-md"
      title="Delete lego set"
    >
      <p className="mb-5">
        Do you really want to delete lego set{' '}
        <b className="font-medium">{name}</b>?
      </p>

      <div className="flex flex-col">
        <Button onClick={() => model.disclosure.close()}>Cancel</Button>
        <Button onClick={() => model.deleteLegoSet()}>Delete</Button>
      </div>
    </Modal>
  );
};
