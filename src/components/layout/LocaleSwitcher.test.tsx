import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { LocaleSwitcher } from './LocaleSwitcher';

const pathname = vi.hoisted(() => ({ value: '/sk' }));

vi.mock('next/navigation', () => ({ usePathname: () => pathname.value }));

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
});
