export const locales = ['sk', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'sk';

export const defaultNamespace = 'common';

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

// i18next hands back a plain string; anything unexpected falls back rather than
// leaking into Intl as an unknown tag.
export function toLocale(value: string | undefined): Locale {
  return value !== undefined && isLocale(value) ? value : defaultLocale;
}
