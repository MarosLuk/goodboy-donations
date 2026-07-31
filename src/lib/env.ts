import { z } from 'zod';

// NEXT_PUBLIC_* values are inlined at build time, so each one has to be read as a
// literal member access — a dynamic lookup on process.env comes out undefined.
// A "<contribution>/<contributors>" pair, which the results endpoint is answered with
// instead of being called. It exists so the screen can be shown with the design's own
// figures while the shared demo database holds whatever the last person to try the form
// left in it. Optional, and meant to stay unset anywhere the real total is the point:
// these are the sums a visitor is being asked to add to, so a made-up one has to be a
// deliberate act rather than the default.
const demoResults = z
  .string()
  .regex(/^\d+\/\d+$/, 'Expected "<contribution>/<contributors>", for example 12200/1028')
  .transform((value) => {
    const [contribution, contributors] = value.split('/').map(Number);

    return { contribution, contributors };
  });

const schema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.url().transform((value) => value.replace(/\/+$/, '')),
  // Needed as metadataBase so an og:image resolves to an absolute url; a relative one is
  // ignored by every crawler.
  NEXT_PUBLIC_SITE_URL: z.url().transform((value) => value.replace(/\/+$/, '')),
  NEXT_PUBLIC_DEMO_RESULTS: demoResults.optional(),
});

const parsed = schema.safeParse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  // An empty value in an env file means unset, not a pair that fails the pattern.
  NEXT_PUBLIC_DEMO_RESULTS: process.env.NEXT_PUBLIC_DEMO_RESULTS || undefined,
});

if (!parsed.success) {
  throw new Error(`Invalid environment variables\n${z.prettifyError(parsed.error)}`);
}

export const env = parsed.data;
