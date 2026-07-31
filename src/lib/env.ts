import { z } from 'zod';

// NEXT_PUBLIC_* values are inlined at build time, so each one has to be read as a
// literal member access — a dynamic lookup on process.env comes out undefined.
const schema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.url().transform((value) => value.replace(/\/+$/, '')),
  // Needed as metadataBase so an og:image resolves to an absolute url; a relative one is
  // ignored by every crawler.
  NEXT_PUBLIC_SITE_URL: z.url().transform((value) => value.replace(/\/+$/, '')),
});

const parsed = schema.safeParse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!parsed.success) {
  throw new Error(`Invalid environment variables\n${z.prettifyError(parsed.error)}`);
}

export const env = parsed.data;
