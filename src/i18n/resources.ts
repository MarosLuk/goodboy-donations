import en from './locales/en/common.json';
import sk from './locales/sk/common.json';
import { defaultNamespace } from './settings';

// Two locales, one namespace — bundling them beats a lazy backend, which would
// render raw keys on the first paint until the fetch resolves.
export const resources = {
  sk: { [defaultNamespace]: sk },
  en: { [defaultNamespace]: en },
};
