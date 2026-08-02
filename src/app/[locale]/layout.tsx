import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { InlineScript } from '@/components/ui/InlineScript';
import { I18nProvider } from '@/i18n/I18nProvider';
import { createServerI18n } from '@/i18n/server';
import { defaultLocale, isLocale, locales } from '@/i18n/settings';
import { env } from '@/lib/env';
import { QueryProvider } from '@/lib/query/QueryProvider';
import { colorSchemeScript } from '@/styles/color-scheme';
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
  // Set by the proxy, and the reason no page here is prerendered: a nonce is only a nonce if
  // it is minted for the one request that carries it. Reading the request in the layout is
  // what puts every page under the same rule, rather than each of them remembering to.
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    /* The scheme attribute is written by the script below, after this markup was already
       rendered on the server, so React is told not to read that as a mismatch. */
    <html lang={activeLocale} className={inter.variable} suppressHydrationWarning>
      {/* In the head rather than the body: the browser runs it while parsing, so a
          remembered choice is in place before anything at all is painted. */}
      <head>
        <InlineScript html={colorSchemeScript} nonce={nonce} />
      </head>

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
