import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import AboutPage from './page';

// The results summary was built, tested and then rendered nowhere, which no test noticed
// because every one of them mounted the component directly. This one renders the page, so
// the numbers the assignment asks for have to actually reach a screen.

async function renderPage(locale: 'sk' | 'en' = 'sk') {
  const page = await AboutPage({
    params: Promise.resolve({ locale }),
    // The page ignores it, but the generated props type requires it.
    searchParams: Promise.resolve({}),
  });

  return renderWithProviders(page, { locale });
}

describe('the about page', () => {
  it('carries the two metrics', async () => {
    await renderPage();

    await waitFor(() => expect(screen.getAllByRole('definition')).toHaveLength(2));

    expect(screen.getAllByRole('term').map((element) => element.textContent)).toEqual([
      'Vyzbieraná suma',
      'Počet darcov',
    ]);
  });

  it('opens with a heading and the foundation text', async () => {
    await renderPage();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('O projekte');
    expect(screen.getByText(/Nadácia Good Boy sa venuje/)).toBeInTheDocument();
    expect(screen.getByText(/Naša práca je možná/)).toBeInTheDocument();
  });

  it('is reachable from the footer of the page it links back to', async () => {
    await renderPage();

    expect(screen.getByRole('link', { name: 'O projekte' })).toHaveAttribute('href', '/sk/about');
    expect(screen.getByRole('link', { name: 'Späť' })).toHaveAttribute('href', '/sk');
  });

  it('reads in english too', async () => {
    await renderPage('en');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About the project');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/en/about');
  });
});
