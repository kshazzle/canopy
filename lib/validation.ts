import type { ZodType } from "zod";

/** Parse unknown values with Zod, returning null instead of throwing. */
export function parseOrNull<T>(schema: ZodType<T>, value: unknown): T | null {
  const result = schema.safeParse(value);
  return result.success ? result.data : null;
}
