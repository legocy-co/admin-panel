import { UserImageSchema } from './UserImage.ts';
import { z } from 'zod';

export type RegisterAdminData = {
  email: string;
  password: string;
  username: string;
};

export type UserData = {
  email: string;
  role: number;
  username: string;
};

export type User = z.infer<typeof UserSchema>;

export const UserSchema = z.object({
  id: z.number(),
  username: z.string().min(1),
  email: z.string().min(1).email().optional(),
  images: z.array(UserImageSchema).optional(),
  password: z.string().optional(),
  role: z.number().optional(),
});
