import { UserImageSchema } from './UserImage.ts';
import { z } from 'zod';

export type User = z.infer<typeof UserSchema>;

export const UserSchema = z.object({
  id: z.number(),
  username: z.string().min(1),
  email: z.string().min(1).optional(),
  images: z.array(UserImageSchema).optional(),
  role: z.number().optional(),
});
