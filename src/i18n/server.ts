import { createInstance } from 'i18next';
import { i18nOptions } from './config';
import type { Locale } from './settings';
import { defaultLocale } from './settings';

// Plain i18next, deliberately without initReactI18next: that plugin touches
// React.createContext while the module loads, which is not available where Next
// evaluates server files. Server code only needs t(), not the React bindings.
export function createServerI18n(locale: Locale = defaultLocale) {
  const instance = createInstance();

  instance.init(i18nOptions(locale));

  return instance;
}
