import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { LocaleSwitcher } from './LocaleSwitcher';

const pathname = vi.hoisted(() => ({ value: '/sk' }));
const push = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  usePathname: () => pathname.value,
  useRouter: () => ({ push }),
}));

beforeEach(() => {
  push.mockClear();
  window.history.replaceState(null, '', '/sk');
});

function renderAt(path: string, locale: 'sk' | 'en' = 'sk') {
  pathname.value = path;

  return renderWithProviders(<LocaleSwitcher />, { locale });
}

describe('the locale switcher', () => {
  it('offers both languages and marks the one in use', () => {
    renderAt('/sk');

    expect(screen.getByRole('link', { name: 'Slovenčina' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    expect(screen.getByRole('link', { name: 'Angličtina' })).not.toHaveAttribute('aria-current');
  });

  // Switching language on a subpage has to stay on that subpage, which is the whole reason
  // the path is rebuilt rather than pointing at the root.
  it('keeps the page when it swaps the locale segment', () => {
    renderAt('/sk/contact');

    expect(screen.getByRole('link', { name: 'Angličtina' })).toHaveAttribute('href', '/en/contact');
    expect(screen.getByRole('link', { name: 'Slovenčina' })).toHaveAttribute('href', '/sk/contact');
  });

  it('lands on the root of the other language from the form', () => {
    renderAt('/sk');

    expect(screen.getByRole('link', { name: 'Angličtina' })).toHaveAttribute('href', '/en');
  });

  it('reads the other way round in english', () => {
    renderAt('/en/about', 'en');

    expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'Slovak' })).toHaveAttribute('href', '/sk/about');
  });

  // The href is the plain address, which is what a crawler and a new tab should get. The
  // click adds whatever the page has in its query — the form's step lives there, and losing
  // it would drop the visitor back at the first step in the other language.
  it('carries the query across on a click', () => {
    window.history.replaceState(null, '', '/sk?step=2');
    renderAt('/sk');

    const link = screen.getByRole('link', { name: 'Angličtina' });

    expect(link).toHaveAttribute('href', '/en');

    fireEvent.click(link);

    expect(push).toHaveBeenCalledWith('/en?step=2');
  });

  // A new tab starts with nothing to carry, so those are left to the browser.
  it('leaves a click meant for a new tab alone', () => {
    window.history.replaceState(null, '', '/sk?step=2');
    renderAt('/sk');

    fireEvent.click(screen.getByRole('link', { name: 'Angličtina' }), { metaKey: true });

    expect(push).not.toHaveBeenCalled();
  });
});
