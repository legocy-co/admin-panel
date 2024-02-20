import { z } from 'zod';

export default function objectKeysToZodEnum<T extends string>(
  object: Record<T, any>
): z.ZodEnum<[T, ...T[]]> {
  const [firstKey, ...otherKeys] = Object.keys(object) as T[];
  return z.enum([firstKey, ...otherKeys]);
}
