'use client';

import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

// Moving between steps swaps the whole screen without a page load, so focus would
// otherwise stay on a button that no longer exists and a screen reader would announce
// nothing. Focus lands on the heading of the step that arrived.
//
// Deliberately skips the first run: focusing something on page load would steal focus
// from the address bar and scroll the page for no reason.
export function useFocusOnStepChange(container: RefObject<HTMLElement | null>, key: unknown) {
  const previous = useRef(key);

  useEffect(() => {
    if (previous.current === key) {
      return;
    }

    previous.current = key;
    container.current?.querySelector<HTMLElement>('[data-step-heading]')?.focus();
  }, [container, key]);
}
