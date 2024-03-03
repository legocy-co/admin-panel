import { User } from '../../types/UserType.ts';

export type UserRow = {
  id: number;
  role: string;
  email: string;
  username: string;
};

export const columns = [
  {
    id: 'role',
    size: 200,
    title: 'Role',
  },
  {
    id: 'email',
    size: 400,
    title: 'Email',
  },
  {
    id: 'username',
    size: 400,
    title: 'Username',
  },
];

export function toUserRows(response: User[]): UserRow[] {
  return response.map((user) => ({
    id: user.id,
    role: user.role ? 'Admin' : 'User',
    email: user.email,
    username: user.username,
  }));
}
