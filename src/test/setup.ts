import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom ships no layout engine and therefore no scrollIntoView, which every list
// widget calls to keep the active option in view. Stubbed rather than guarded at
// the call site, since the browsers this ships to all implement it.
Element.prototype.scrollIntoView = () => {};

afterEach(() => {
  cleanup();
});
