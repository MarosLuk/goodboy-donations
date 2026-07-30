'use client';

import { useEffect, useState } from 'react';

// Typing is what the user sees; the request is what the server sees. This puts a
// pause between the two so a shelter name is not eight requests long.
export function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
