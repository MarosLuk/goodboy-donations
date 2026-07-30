import { z } from 'zod';
import { apiGet } from '@/lib/api/client';

const resultsSchema = z.object({
  contributors: z.number(),
  // The spec types this as a number, but the api answers null while nothing has
  // been collected yet.
  contribution: z.number().nullable(),
});

export type Results = z.infer<typeof resultsSchema>;

// No search parameter on purpose: the endpoint accepts one and ignores it, so
// offering it would promise a per-shelter total that does not exist.
export function fetchResults({ signal }: { signal?: AbortSignal } = {}) {
  return apiGet({
    path: '/api/v1/shelters/results',
    schema: resultsSchema,
    signal,
  });
}
