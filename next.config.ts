import type { NextConfig } from 'next';

// The headers that do not depend on the request. The one that does — Content-Security-Policy,
// which carries a nonce minted per request — is set in `src/proxy.ts`.
const securityHeaders = [
  // Two years, subdomains included, and short of the preload list only because a domain
  // belongs on that list once it is the real one.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  // No sniffing: a response is the type it says it is, so an upload that looks like markup
  // cannot be talked into being executed as any.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // A cross-origin destination learns which site the visitor came from, never which step of
  // the form they were on.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Nothing here asks for hardware, so nothing may.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // `frame-ancestors` in the policy says the same, and this is what says it to a browser old
  // enough not to read that directive. A donation form is worth keeping out of a frame: it is
  // the kind of page clickjacking is aimed at.
  { key: 'X-Frame-Options', value: 'DENY' },
  // A window this page opens, or one that opened it, gets no handle on it.
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const nextConfig: NextConfig = {
  // Compile-time transform for styled-components: class names stay stable between
  // the server and client render, and components get readable display names.
  compiler: {
    styledComponents: true,
  },
  // Which framework serves the page, and which version of it, is nobody's business.
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
