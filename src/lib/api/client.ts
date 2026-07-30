import type { z } from 'zod';
import { env } from '@/lib/env';
import { ApiError, apiMessagesSchema } from './errors';

type QueryValue = string | number | undefined;

type RequestOptions<T> = {
  path: string;
  schema: z.ZodType<T>;
  method?: 'GET' | 'POST';
  body?: unknown;
  query?: Record<string, QueryValue>;
  signal?: AbortSignal;
};

function buildUrl(path: string, query: Record<string, QueryValue> = {}) {
  const url = new URL(`${env.NEXT_PUBLIC_API_BASE_URL}${path}`);

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

export async function apiRequest<T>({
  path,
  schema,
  method = 'GET',
  body,
  query,
  signal,
}: RequestOptions<T>): Promise<T> {
  const response = await fetch(buildUrl(path, query), {
    method,
    signal,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    // A 500 or a proxy can answer with anything, so an unreadable body must not
    // swallow the status code — the caller still gets a typed error, just without
    // field-level messages.
    const parsed = apiMessagesSchema.safeParse(payload);
    throw new ApiError(response.status, parsed.success ? parsed.data.messages : []);
  }

  return schema.parse(payload);
}

export function apiGet<T>(options: Omit<RequestOptions<T>, 'method' | 'body'>) {
  return apiRequest(options);
}

export function apiPost<T>(options: Omit<RequestOptions<T>, 'method'>) {
  return apiRequest({ ...options, method: 'POST' });
}
