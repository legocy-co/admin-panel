import { z } from 'zod';

export type UserImage = z.infer<typeof UserImageSchema>;

export const UserImageSchema = z.object({
  userID: z.number().optional(),
  filepath: z.string().optional(),
  downloadURL: z.string().optional(),
});
