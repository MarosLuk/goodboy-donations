import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { defaultLocale, isLocale, locales } from '@/i18n/settings';

function preferredLocale(header: string | null) {
  if (!header) {
    return defaultLocale;
  }

  const ranked = header
    .split(',')
    .map((entry) => {
      const [tag, ...parameters] = entry.trim().split(';');
      const quality = Number.parseFloat(
        parameters.find((parameter) => parameter.startsWith('q='))?.slice(2) ?? '1',
      );

      return { tag: tag.toLowerCase(), quality: Number.isNaN(quality) ? 1 : quality };
    })
    .sort((a, b) => b.quality - a.quality);

  // en-GB and en both mean en, so only the base tag is matched.
  const match = ranked.find(({ tag }) => isLocale(tag.split('-')[0]));

  return match ? (match.tag.split('-')[0] as typeof defaultLocale) : defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocale) {
    return;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request.headers.get('accept-language'))}${
    pathname === '/' ? '' : pathname
  }`;

  return NextResponse.redirect(url);
}

export const config = {
  // Everything except Next internals and anything with a file extension, so
  // favicon.ico and static assets are served as they are.
  matcher: ['/((?!_next|.*\\.).*)'],
};
