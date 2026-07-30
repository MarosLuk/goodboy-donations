import type { Locale } from '@/i18n/settings';

const intlLocales: Record<Locale, string> = {
  sk: 'sk-SK',
  en: 'en-GB',
};

// Whole euros stay whole, cents always come as a pair: "1 234 €" reads better than
// "1 234,00 €" for a fundraising total, while "1 234,50 €" beats "1 234,5 €". Not
// rounding at all, because dropping part of a donated amount would be a small lie.
export function formatCurrency(value: number, locale: Locale) {
  const cents = !Number.isInteger(value);

  return new Intl.NumberFormat(intlLocales[locale], {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCount(value: number, locale: Locale) {
  return new Intl.NumberFormat(intlLocales[locale]).format(value);
}
