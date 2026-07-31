import { fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { COLOR_SCHEME_KEY, colorSchemeScript } from '@/styles/color-scheme';
import { renderWithProviders } from '@/test/render';
import { ColorSchemeToggle } from './ColorSchemeToggle';

const toggle = () => screen.getByRole('button', { name: 'Tmavý režim' });

describe('the colour scheme toggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('turns the page dark and remembers it', () => {
    renderWithProviders(<ColorSchemeToggle />);

    fireEvent.click(toggle());

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(window.localStorage.getItem(COLOR_SCHEME_KEY)).toBe('dark');
    expect(toggle()).toHaveAttribute('aria-pressed', 'true');
  });

  // Going back has to record light rather than clear the choice, otherwise someone on a
  // dark system could never get a light page.
  it('turns it back and records that too', () => {
    renderWithProviders(<ColorSchemeToggle />);

    fireEvent.click(toggle());
    fireEvent.click(toggle());

    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(window.localStorage.getItem(COLOR_SCHEME_KEY)).toBe('light');
    expect(toggle()).toHaveAttribute('aria-pressed', 'false');
  });

  it('comes up pressed when dark was already chosen', () => {
    window.localStorage.setItem(COLOR_SCHEME_KEY, 'dark');

    renderWithProviders(<ColorSchemeToggle />);

    expect(toggle()).toHaveAttribute('aria-pressed', 'true');
  });

  // The script ships as a string in the layout, where nothing type-checks it. Running it is
  // the only way to know it still does its job.
  it('has a script that applies the stored choice on its own', () => {
    window.localStorage.setItem(COLOR_SCHEME_KEY, 'dark');

    new Function(colorSchemeScript)();

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });
});
