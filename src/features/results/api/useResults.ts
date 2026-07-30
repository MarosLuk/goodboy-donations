'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchResults } from './results';

export const resultKeys = {
  all: ['results'] as const,
};

export function useResults() {
  return useQuery({
    queryKey: resultKeys.all,
    queryFn: ({ signal }) => fetchResults({ signal }),
    // The total moves whenever anyone donates, so it goes stale sooner than the
    // list of shelters.
    staleTime: 30 * 1000,
  });
}
