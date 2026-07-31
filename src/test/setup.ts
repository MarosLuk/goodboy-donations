import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './msw/server';

// jsdom ships no layout engine and therefore no scrollIntoView, which every list
// widget calls to keep the active option in view. Stubbed rather than guarded at
// the call site, since the browsers this ships to all implement it.
Element.prototype.scrollIntoView = () => {};

// Node runs its own localStorage, switched off unless started with --localstorage-file, and
// it shadows the one jsdom brings. Browsers all have it, so the environment gets a plain
// stand-in; the guards around it in the app are there for a refusal to store, not for this.
if (window.localStorage == null) {
  const entries = new Map<string, string>();

  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => entries.get(key) ?? null,
      setItem: (key: string, value: string) => void entries.set(key, String(value)),
      removeItem: (key: string) => void entries.delete(key),
      clear: () => entries.clear(),
      key: (index: number) => Array.from(entries.keys())[index] ?? null,
      get length() {
        return entries.size;
      },
    } satisfies Storage,
  });
}

// jsdom 30 carries no matchMedia at all, and the colour scheme toggle asks it which scheme
// the system prefers. This answers light and remembers no listeners — a test that needs the
// other answer replaces it for itself.
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (media: string) =>
    ({
      media,
      matches: false,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) satisfies MediaQueryList;
}

// An unhandled request means a test is reaching for the real network, which is a
// fault in the test rather than something to quietly allow through.
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
