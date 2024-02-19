import { Rule } from 'effector-forms';
import { z } from 'zod';

export function createRule<V, T = unknown>({
  schema,
  name,
}: {
  schema: z.Schema<T>;
  name: string;
}): Rule<V> {
  return {
    name,
    validator: (value: V) => {
      const parsedSchema = schema.safeParse(value);
      if (parsedSchema.success) return { isValid: true, value: value };

      return {
        isValid: false,
        value: value,
        errorText: parsedSchema.error.issues[0]?.message ?? 'error_occurred',
      };
    },
  };
}
