import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './msw/server';

// jsdom ships no layout engine and therefore no scrollIntoView, which every list
// widget calls to keep the active option in view. Stubbed rather than guarded at
// the call site, since the browsers this ships to all implement it.
Element.prototype.scrollIntoView = () => {};

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
