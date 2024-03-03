import { User, UserSchema } from '../types/UserType.ts';
import axios from 'axios';
import { handleIncorrectParse } from './ErrorHandlers.ts';

interface UserService {
  GetUsers: () => Promise<User[]>;
}

const GetUsers = async (): Promise<User[]> => {
  const response = await axios.get<object[]>('/admin/users/');
  const result = UserSchema.array().safeParse(response.data);
  if (!result.success)
    return handleIncorrectParse(result.error, 'GetUsers', "Can't get users");

  return result.data;
};

export const userService: UserService = {
  GetUsers: GetUsers,
};
