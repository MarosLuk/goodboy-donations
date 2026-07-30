'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from './client';

export function QueryProvider({ children }: { children: ReactNode }) {
  // Lazy initial state keeps one client per mounted tree — building it inline would
  // hand every re-render a fresh, empty cache.
  const [client] = useState(createQueryClient);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
