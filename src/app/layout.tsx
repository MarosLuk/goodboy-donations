import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { I18nProvider } from '@/i18n/I18nProvider';
import { createServerI18n } from '@/i18n/server';
import { defaultLocale } from '@/i18n/settings';
import { QueryProvider } from '@/lib/query/QueryProvider';
import { StyleProvider } from '@/styles/StyleProvider';

const inter = Inter({
  // latin-ext carries the Slovak diacritics.
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

export function generateMetadata(): Metadata {
  const { t } = createServerI18n(defaultLocale);

  return {
    title: t('app.title'),
    description: t('app.description'),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale} className={inter.variable}>
      <body>
        <StyleProvider>
          <QueryProvider>
            <I18nProvider locale={defaultLocale}>{children}</I18nProvider>
          </QueryProvider>
        </StyleProvider>
      </body>
    </html>
  );
}
