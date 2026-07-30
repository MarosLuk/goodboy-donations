import type { InitOptions } from 'i18next';
import { resources } from './resources';
import type { Locale } from './settings';
import { defaultLocale, defaultNamespace, locales } from './settings';

export function i18nOptions(locale: Locale): InitOptions {
  return {
    lng: locale,
    fallbackLng: defaultLocale,
    supportedLngs: [...locales],
    ns: [defaultNamespace],
    defaultNS: defaultNamespace,
    resources,
    // React escapes interpolated values on its own.
    interpolation: { escapeValue: false },
  };
}
