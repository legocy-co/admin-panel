import { PageHeading } from '../../../shared/ui/page-heading.tsx';
import { history } from '../../../routes/history.ts';
import { UserForm } from '../../../features/user/ui.tsx';

export const UpdateUserPage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <PageHeading to={'/users/' + history.location?.pathname.split('/')[3]}>
        Update user
      </PageHeading>
      <UserForm />
    </div>
  );
};
