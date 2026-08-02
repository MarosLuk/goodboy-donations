import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { defaultLocale, isLocale, locales } from '@/i18n/settings';
import { env } from '@/lib/env';

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

/**
 * The policy, minted fresh for every request.
 *
 * Next writes inline scripts of its own — the flight payload among them — so a policy that
 * allowed no inline script at all would serve markup that never hydrates. A nonce names
 * exactly those and nothing an injection could add, and `strict-dynamic` lets them pull the
 * chunks they import without every bundle having to be listed by hand.
 *
 * The cost is that nothing can be prerendered: a nonce baked in at build time would not
 * match the header the visitor arrives with. Reading the request in the layout is what holds
 * every page to rendering on demand.
 */
function contentSecurityPolicy(nonce: string) {
  const isDev = process.env.NODE_ENV === 'development';

  return [
    `default-src 'self'`,
    // eval is how React rebuilds a server stack in the browser while developing. A
    // production build has no use for it, so a production policy does not grant it.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    // Inline has to be allowed here, and a nonce would not help: motion animates through the
    // style attribute and next/image sizes itself the same way, and a policy that names a
    // nonce stops honouring 'unsafe-inline' at all. The directives that would separate the
    // two cases, style-src-elem and style-src-attr, are Chromium's alone. It costs little:
    // with img-src and connect-src closed, injected css has nowhere to send what it reads,
    // and script-src above is where a policy earns its keep.
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' blob: data:`,
    `font-src 'self'`,
    // The assignment api is the only origin the browser may reach, since the form posts to
    // it from the page itself. The socket is the development server's reload channel.
    `connect-src 'self' ${env.NEXT_PUBLIC_API_BASE_URL}${isDev ? ' ws:' : ''}`,
    `object-src 'none'`,
    // Nothing here sets a base element, and an injected one would silently repoint every
    // relative url on the page.
    `base-uri 'none'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    'upgrade-insecure-requests',
  ].join('; ');
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (!hasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale(request.headers.get('accept-language'))}${
      pathname === '/' ? '' : pathname
    }`;

    return NextResponse.redirect(url);
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const policy = contentSecurityPolicy(nonce);

  // On the request as well as on the response: the renderer reads the nonce back out of the
  // policy to mark the scripts it writes itself, and the layout reads `x-nonce` to mark the
  // one script this app contributes.
  const headers = new Headers(request.headers);
  headers.set('x-nonce', nonce);
  headers.set('Content-Security-Policy', policy);
  // The 404 screen is rendered outside the locale segment, so the segment cannot tell it which
  // language to answer in. The path can, and this is the last place that still has it.
  headers.set('x-locale', pathname.split('/')[1]);

  const response = NextResponse.next({ request: { headers } });
  response.headers.set('Content-Security-Policy', policy);

  return response;
}

export const config = {
  matcher: [
    {
      // Everything except the framework's internals and the two static things this app
      // actually serves. Naming them beats excluding every path that carries a dot: that
      // exclusion let `/anything.php` past the locale redirect, and an address with no locale
      // and no route of its own is answered with the framework's own english page and a 200 —
      // a not-found that says it was found. Anything added to `public/` belongs on this list.
      source: '/((?!_next|images/|favicon.ico).*)',
      // A prefetch asks for a payload rather than a document, so there is no markup for a
      // policy to govern and no nonce for it to carry.
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
