import { z } from 'zod';

// NEXT_PUBLIC_* values are inlined at build time, so each one has to be read as a
// literal member access — a dynamic lookup on process.env comes out undefined.
const schema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.url().transform((value) => value.replace(/\/+$/, '')),
});

const parsed = schema.safeParse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

if (!parsed.success) {
  throw new Error(`Invalid environment variables\n${z.prettifyError(parsed.error)}`);
}

export const env = parsed.data;
