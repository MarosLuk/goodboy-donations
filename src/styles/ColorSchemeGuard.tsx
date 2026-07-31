'use client';

import { useEffect, useLayoutEffect } from 'react';
import { applyScheme, readStoredScheme } from './color-scheme';

// The effect only has work to do in a browser, and asking for a layout effect on the server
// is what earns React's warning about it. Same hook either way, chosen once.
const useBeforePaint = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Puts the remembered scheme back on `<html>` after a render that dropped it.
 *
 * The script in the head sets it before the first paint, but the attribute was never
 * React's: the root layout lives inside the locale segment, so changing language has React
 * build that element again from the payload, and anything set outside it goes. A layout
 * effect runs in the same frame as the commit, so the page never paints without it.
 */
export function ColorSchemeGuard() {
  // No dependencies: what it guards against is the render itself, not a change in any value.
  useBeforePaint(() => {
    const stored = readStoredScheme();

    if (stored) {
      applyScheme(stored);
    }
  });

  return null;
}
