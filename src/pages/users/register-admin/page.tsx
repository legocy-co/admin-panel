import { RegisterAdmin } from '../../../features/user/register-admin';

export const RegisterAdminPage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <p className="text-2xl font-semibold mb-10">Register admin</p>
      <RegisterAdmin />
    </div>
  );
};
