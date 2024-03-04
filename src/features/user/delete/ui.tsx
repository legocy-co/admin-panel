import { useUnit } from 'effector-react';
import * as model from './model.ts';
import { Modal } from '../../../shared/ui/modal.tsx';
import { Button } from '../../../shared/ui/button.tsx';

export const DeleteUser = () => {
  const [isOpen, name] = useUnit([model.disclosure.$isOpen, model.$username]);
  return (
    <Modal
      open={isOpen}
      onClose={() => model.disclosure.close()}
      className="max-w-md"
      title="Delete lego set"
    >
      <p className="mb-5">
        Do you really want to delete user <b className="font-medium">{name}</b>?
      </p>
      <div className="flex gap-2">
        <Button onClick={() => model.disclosure.close()}>Cancel</Button>
        <Button onClick={() => model.deleteUser()}>Delete</Button>
      </div>
    </Modal>
  );
};
