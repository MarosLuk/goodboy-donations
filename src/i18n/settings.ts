export const locales = ['sk', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'sk';

export const defaultNamespace = 'common';
