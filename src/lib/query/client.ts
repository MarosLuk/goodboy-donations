import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/lib/api/errors';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // A rejected request will not be accepted on the second ask; only server
          // and network failures are worth repeating.
          if (error instanceof ApiError && error.status < 500) {
            return false;
          }

          return failureCount < 2;
        },
      },
      // A retried contribution would be a second donation, so mutations get one try.
      mutations: { retry: false },
    },
  });
}
