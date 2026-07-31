import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { resultsUrl } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderWithProviders } from '@/test/render';
import { ResultsSummary } from './ResultsSummary';

// Intl puts a non-breaking space between the number and the currency.
function texts(role: 'definition' | 'term') {
  return screen.getAllByRole(role).map((element) => element.textContent?.replace(/ /g, ' '));
}

describe('ResultsSummary', () => {
  // The figures count up to where they belong, so what matters is where they stop.
  it('shows the total and the donor count', async () => {
    renderWithProviders(<ResultsSummary />);

    await waitFor(() => expect(texts('definition')).toEqual(['5 €', '6']));

    expect(texts('term')).toEqual(['Celková vyzbieraná hodnota', 'Počet darcov']);
  });

  it('starts from nothing rather than appearing at the figure', async () => {
    renderWithProviders(<ResultsSummary />);

    await waitFor(() => expect(screen.getAllByRole('definition')).toHaveLength(2));

    expect(texts('definition')).toEqual(['0 €', '0']);
  });

  it('reads a null total as nothing collected yet', async () => {
    server.use(
      http.get(resultsUrl, () => HttpResponse.json({ contributors: 0, contribution: null })),
    );

    renderWithProviders(<ResultsSummary />);

    await waitFor(() => expect(screen.getAllByRole('definition')).toHaveLength(2));

    expect(texts('definition')).toEqual(['0 €', '0']);
  });

  it('does not show zeroes before the numbers arrive', () => {
    renderWithProviders(<ResultsSummary />);

    expect(screen.getByText('Načítavam…')).toBeInTheDocument();
    expect(screen.queryByRole('definition')).not.toBeInTheDocument();
  });

  it('says so when the numbers cannot be loaded', async () => {
    server.use(http.get(resultsUrl, () => new HttpResponse(null, { status: 500 })));

    renderWithProviders(<ResultsSummary />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Údaje sa nepodarilo načítať');
    expect(screen.queryByRole('definition')).not.toBeInTheDocument();
  });

  it('formats the amount for the active locale', async () => {
    server.use(
      http.get(resultsUrl, () => HttpResponse.json({ contributors: 1234, contribution: 1234.5 })),
    );

    renderWithProviders(<ResultsSummary />, { locale: 'en' });

    // Cents are the reason the last frame formats the exact figure instead of a rounded one:
    // landing on €1,235 would quietly lose half a euro somebody gave. They only show up on
    // that final frame, so this one has to outwait the count rather than the default second.
    await waitFor(() => expect(texts('definition')).toEqual(['€1,234.50', '1,234']), {
      timeout: 2500,
    });

    expect(texts('term')).toEqual(['Total amount raised', 'Donors']);
  });
});
