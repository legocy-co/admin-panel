import { UserImageSchema } from './UserImage.ts';
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  username: z.string().min(1),
  email: z.string().min(1).email().optional(),
  images: z.array(UserImageSchema),
  role: z.number().optional(),
});
