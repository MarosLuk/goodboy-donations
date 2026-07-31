'use client';

import { useMutation } from '@tanstack/react-query';
import type { ContributePayload } from '../lib/payload';
import { contribute } from './contribute';

// Retries are off globally for mutations, which matters most here: a repeated request
// would be a second donation.
export function useContribute() {
  return useMutation({
    mutationFn: (payload: ContributePayload) => contribute({ payload }),
  });
}
