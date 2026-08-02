import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { InlineScript } from '@/components/ui/InlineScript';
import { I18nProvider } from '@/i18n/I18nProvider';
import { createServerI18n } from '@/i18n/server';
import { toLocale } from '@/i18n/settings';
import { colorSchemeScript } from '@/styles/color-scheme';
import { StyleProvider } from '@/styles/StyleProvider';
import { NotFoundScreen } from './NotFoundScreen';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

// Set by the proxy, which is the last place that still knows the path the visitor asked for.
async function requestedLocale() {
  return toLocale((await headers()).get('x-locale') ?? undefined);
}

export async function generateMetadata(): Promise<Metadata> {
  const { t } = createServerI18n(await requestedLocale());

  return { title: t('notFound.title'), description: t('notFound.body') };
}

/**
 * The 404 screen for the whole app.
 *
 * A url matching no route cannot be answered from `layout.tsx` and a `not-found.tsx` here,
 * because the root layout is a dynamic segment: the framework has nothing to fill `[locale]`
 * with, so it renders the boundary in a bare shell of its own instead, with none of the
 * providers the screen needs. `global-not-found` is the documented answer to exactly that, and
 * the trade is that this file owns the whole document — the language, the font, the theme and the
 * script that applies a remembered colour scheme all have to be set up again here.
 *
 * Reading the request is also what keeps the screen rendering per request, which is what lets its
 * scripts carry the nonce the policy names. Prerendered, they would carry one from build time and
 * the browser would refuse every one of them.
 */
export default async function GlobalNotFound() {
  const requestHeaders = await headers();
  const nonce = requestHeaders.get('x-nonce') ?? undefined;
  const locale = toLocale(requestHeaders.get('x-locale') ?? undefined);

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <head>
        <InlineScript html={colorSchemeScript} nonce={nonce} />
      </head>

      <body>
        <StyleProvider>
          <I18nProvider locale={locale}>
            <NotFoundScreen />
          </I18nProvider>
        </StyleProvider>
      </body>
    </html>
  );
}
