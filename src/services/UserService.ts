import {
  User,
  RegisterAdminData,
  UserSchema,
  UserData,
} from '../types/UserType.ts';
import axios from 'axios';
import { handleIncorrectParse, handleUserError } from './ErrorHandlers.ts';
import toaster from '../shared/lib/react-toastify.ts';
import { ra } from '../features/user/register-admin/index.tsx';

interface UserService {
  GetUsers: () => Promise<User[]>;
  RegisterAdmin: (data: RegisterAdminData) => Promise<boolean>;
  GetUser: (id: number | string) => Promise<User>;
  UpdateUser: (id: number | string, user: UserData) => Promise<boolean>;
  DeleteUser: (id: number | string) => Promise<boolean>;
}

const GetUsers = async (): Promise<User[]> => {
  const response = await axios.get<object[]>('/admin/users/');
  const result = UserSchema.array().safeParse(response.data);
  if (!result.success)
    return handleIncorrectParse(result.error, 'GetUsers', "Can't get users");

  return result.data;
};

const RegisterAdmin = async (data: RegisterAdminData): Promise<boolean> => {
  try {
    await axios.post('/admin/users/register/', data);
    toaster.showToastSuccess('Admin registered');

    return Promise.resolve(true);
  } catch (e) {
    return handleUserError(e, 'Admin', ra.form);
  }
};

const GetUser = async (id: number | string): Promise<User> => {
  const response = await axios.get<object>('/admin/users/' + id);
  const result = UserSchema.safeParse(response.data);
  if (!result.success)
    return handleIncorrectParse(result.error, 'GetUser', "Can't get user");

  return result.data;
};

const UpdateUser = async (
  id: number | string,
  user: UserData
): Promise<boolean> => {
  try {
    await axios.put('/admin/users/' + id, user);
    toaster.showToastSuccess('User updated');

    return Promise.resolve(true);
  } catch (e) {
    return Promise.reject();
    // return handleSetError(e, 'UpdateUser', uf.form);
  }
};

const DeleteUser = async (id: number | string): Promise<boolean> => {
  try {
    await axios.delete('/admin/users/' + id);
    toaster.showToastSuccess('User deleted');

    return Promise.resolve(true);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const userService: UserService = {
  GetUsers: GetUsers,
  RegisterAdmin: RegisterAdmin,
  GetUser: GetUser,
  UpdateUser: UpdateUser,
  DeleteUser: DeleteUser,
};
