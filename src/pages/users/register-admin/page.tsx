import { PageHeading } from '../../../shared/ui/page-heading.tsx';
import { RegisterAdmin } from '../../../features/user/register-admin';

export const RegisterAdminPage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <PageHeading>Register Admin</PageHeading>
      <RegisterAdmin />
    </div>
  );
};
