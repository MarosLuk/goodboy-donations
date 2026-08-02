import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from './proxy';

function visit(path: string, headers: Record<string, string> = {}) {
  return proxy(new NextRequest(new URL(path, 'https://goodboy.test'), { headers }));
}

function policyFor(path: string) {
  const response = visit(path);
  const policy = response?.headers.get('content-security-policy');

  if (!policy) {
    throw new Error(`No policy on ${path}`);
  }

  return policy;
}

function nonceIn(policy: string) {
  const found = policy.match(/'nonce-([^']+)'/);

  if (!found) {
    throw new Error(`No nonce in ${policy}`);
  }

  return found[1];
}

describe('locale negotiation', () => {
  it('sends a visitor without a locale to the language their browser asked for', () => {
    expect(visit('/', { 'accept-language': 'en-GB,en;q=0.9' })?.headers.get('location')).toBe(
      'https://goodboy.test/en',
    );
  });

  it('keeps the rest of the path while adding the locale', () => {
    expect(visit('/contact')?.headers.get('location')).toBe('https://goodboy.test/sk/contact');
  });

  it('leaves a path that already names a locale where it is', () => {
    expect(visit('/sk/contact')?.headers.get('location')).toBeNull();
  });
});

describe('content security policy', () => {
  it('answers a page with a policy', () => {
    expect(policyFor('/sk')).toContain(`default-src 'self'`);
  });

  it('names its scripts by a nonce instead of allowing inline ones', () => {
    const policy = policyFor('/sk');

    expect(policy).toContain(`script-src 'self' 'nonce-${nonceIn(policy)}' 'strict-dynamic'`);
    expect(policy).not.toContain(`script-src 'self' 'unsafe-inline'`);
  });

  // A nonce reused across requests is a nonce an injection can guess from a page it was
  // served earlier, which is the whole point of minting one per request.
  it('mints a different nonce every time', () => {
    expect(nonceIn(policyFor('/sk'))).not.toBe(nonceIn(policyFor('/sk')));
  });

  // The renderer marks its scripts from the nonce it finds on the request, so the two have to
  // be the same value: a page whose scripts carry a nonce the header does not name is a page
  // the browser refuses to run.
  it('hands the renderer the same nonce the header carries', () => {
    const response = visit('/sk');
    const policy = response?.headers.get('content-security-policy') ?? '';

    expect(response?.headers.get('x-middleware-request-x-nonce')).toBe(nonceIn(policy));
  });

  it('lets the browser reach the api the form posts to, and nothing else', () => {
    expect(policyFor('/sk')).toContain(`connect-src 'self' https://api.test`);
  });

  it('closes what a page like this never needs', () => {
    const policy = policyFor('/sk');

    expect(policy).toContain(`object-src 'none'`);
    expect(policy).toContain(`base-uri 'none'`);
    expect(policy).toContain(`frame-ancestors 'none'`);
    expect(policy).toContain(`form-action 'self'`);
  });

  // eval is React's way of rebuilding a server stack while developing. A production build has
  // no use for it, and a policy that grants it there hands an injection a way to run.
  it('does not grant eval outside development', () => {
    expect(policyFor('/sk')).not.toContain('unsafe-eval');
  });
});
