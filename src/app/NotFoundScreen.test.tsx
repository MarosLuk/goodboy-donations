import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { NotFoundScreen } from './NotFoundScreen';

// The footer carries the locale switcher, which reads the path it is on.
vi.mock('next/navigation', () => ({
  usePathname: () => '/sk/nowhere',
  useRouter: () => ({ push: vi.fn() }),
}));

describe('the not found screen', () => {
  it('says what happened in the language it was asked in', () => {
    renderWithProviders(<NotFoundScreen />, { locale: 'en' });

    expect(
      screen.getByRole('heading', { name: 'We could not find this page' }),
    ).toBeInTheDocument();
  });

  // The screen is rendered outside the locale segment, so the language reaches it through the
  // provider rather than a param. If that ever stops working the copy would still read fine in
  // the default language, and only the link would give it away by pointing somewhere else.
  it('offers the way back to the form in that same language', () => {
    renderWithProviders(<NotFoundScreen />, { locale: 'en' });

    expect(screen.getByRole('link', { name: 'Back to donating' })).toHaveAttribute('href', '/en');
  });

  it('answers in slovak when that is what was asked for', () => {
    renderWithProviders(<NotFoundScreen />, { locale: 'sk' });

    expect(screen.getByRole('heading', { name: 'Túto stránku sme nenašli' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Späť na darovanie' })).toHaveAttribute('href', '/sk');
  });
});
