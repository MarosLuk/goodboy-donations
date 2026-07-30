import { z } from 'zod';
import { apiGet } from '@/lib/api/client';

export const shelterSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const sheltersResponseSchema = z.object({
  shelters: z.array(shelterSchema),
});

export type Shelter = z.infer<typeof shelterSchema>;

type FetchSheltersOptions = {
  search?: string;
  signal?: AbortSignal;
};

// The envelope is unwrapped here so nothing above this line has to know the
// response arrives as { shelters: [...] }.
export async function fetchShelters({ search, signal }: FetchSheltersOptions = {}) {
  const { shelters } = await apiGet({
    path: '/api/v1/shelters/',
    schema: sheltersResponseSchema,
    query: { search },
    signal,
  });

  return shelters;
}
