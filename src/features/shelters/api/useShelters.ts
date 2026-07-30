'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchShelters } from './shelters';

export const shelterKeys = {
  all: ['shelters'] as const,
  list: (search: string) => [...shelterKeys.all, 'list', search] as const,
};

export function useShelters(search: string) {
  return useQuery({
    queryKey: shelterKeys.list(search),
    queryFn: ({ signal }) => fetchShelters({ search, signal }),
    // Sixteen shelters do not change while someone fills in a donation.
    staleTime: 5 * 60 * 1000,
    // Every keystroke is a new query key; without this the list would blink empty
    // between the old results and the new ones.
    placeholderData: keepPreviousData,
  });
}
