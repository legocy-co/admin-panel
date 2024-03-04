import { useNavigate, useParams } from 'react-router-dom';
import { useGate, useUnit } from 'effector-react';
import * as model from './model.ts';
import { PageHeading } from '../../../shared/ui/page-heading.tsx';
import { Button } from '../../../shared/ui/button.tsx';

export const UserDetailPage = () => {
  const params = useParams<'id'>();
  const navigate = useNavigate();

  useGate(model.gate, { id: params.id ?? null, navigate });

  const user = useUnit(model.$userDetail);

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <PageHeading to="/users/" />
      <div className="w-[250px] md:w-[577px] align-top inline-block text-xl">
        <p className="text-3xl font-semibold mb-10">{user.username}</p>
        <div className="flex flex-col justify-between h-48 mb-4">
          <p>
            Email:{' '}
            <span className="text-light dark:text-yellow-100">
              {user.email}
            </span>
          </p>
          <p>
            Role:{' '}
            <span className="text-light dark:text-yellow-100">{user.role}</span>
          </p>
        </div>
        <Button
          className="mb-8"
          onClick={() => navigate('/users/update/' + user.id)}
        >
          Edit user
        </Button>
      </div>
    </div>
  );
};
