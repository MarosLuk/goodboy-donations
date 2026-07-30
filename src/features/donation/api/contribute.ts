import { apiPost } from '@/lib/api/client';
import { apiMessagesSchema } from '@/lib/api/errors';
import type { ContributePayload } from '../lib/payload';

export function contribute({
  payload,
  signal,
}: {
  payload: ContributePayload;
  signal?: AbortSignal;
}) {
  return apiPost({
    path: '/api/v1/shelters/contribute',
    body: payload,
    schema: apiMessagesSchema,
    signal,
  });
}
