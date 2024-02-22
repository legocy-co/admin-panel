import { Rule } from 'effector-forms';
import { z } from 'zod';
import { SyntheticEvent } from 'react';
import Image404 from '../assets/pics/404.png';

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

export function addDefaultSrc(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.width = 65;
  e.currentTarget.height = 19;
  e.currentTarget.src = Image404;
}

export const stringifyParams = (
  params: Record<string, string | number | boolean | null | undefined>,
  withQuerySign = true,
  join?: string
) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, val]) => {
    val !== null &&
      val !== '' &&
      val !== undefined &&
      query.append(key, val.toString());
  });

  let stringified = query.toString();

  if (join !== undefined && join.length > 0)
    stringified = [stringified, join].filter(Boolean).join('&');

  if (withQuerySign) return stringified ? `?${stringified}` : '';
  return stringified;
};
