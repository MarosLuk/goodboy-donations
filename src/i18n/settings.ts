export const locales = ['sk', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'sk';

export const defaultNamespace = 'common';

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
