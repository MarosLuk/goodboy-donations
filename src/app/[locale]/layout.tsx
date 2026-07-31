import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { I18nProvider } from '@/i18n/I18nProvider';
import { createServerI18n } from '@/i18n/server';
import { defaultLocale, isLocale, locales } from '@/i18n/settings';
import { env } from '@/lib/env';
import { QueryProvider } from '@/lib/query/QueryProvider';
import { StyleProvider } from '@/styles/StyleProvider';

const inter = Inter({
  // latin-ext carries the Slovak diacritics.
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Both locales are known up front, so any other segment is a 404 rather than a page
// rendered in a language that does not exist.
export const dynamicParams = false;

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = isLocale(locale) ? locale : defaultLocale;
  const { t } = createServerI18n(activeLocale);

  return {
    // Without a base, a relative og:image is dropped by every crawler.
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: t('app.title'),
    description: t('app.description'),
    openGraph: {
      type: 'website',
      siteName: t('app.brand'),
      locale: activeLocale,
      title: t('app.title'),
      description: t('app.description'),
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  const activeLocale = isLocale(locale) ? locale : defaultLocale;

  return (
    <html lang={activeLocale} className={inter.variable}>
      <body>
        <StyleProvider>
          <QueryProvider>
            <I18nProvider locale={activeLocale}>{children}</I18nProvider>
          </QueryProvider>
        </StyleProvider>
      </body>
    </html>
  );
}
