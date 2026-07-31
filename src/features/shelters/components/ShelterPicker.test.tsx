import { fireEvent, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { sheltersUrl } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderWithProviders } from '@/test/render';
import { ShelterPicker } from './ShelterPicker';

describe('ShelterPicker', () => {
  it('offers the shelters the api returned', async () => {
    renderWithProviders(<ShelterPicker value={null} onChange={() => {}} />);

    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });

    expect(await screen.findByText('HAFKÁČI')).toBeInTheDocument();
    expect(screen.getByLabelText(/Útulok/)).toHaveAttribute(
      'placeholder',
      'Vyberte útulok zo zoznamu',
    );
  });

  it('searches on the server once typing settles', async () => {
    const searches: (string | null)[] = [];

    server.use(
      http.get(sheltersUrl, ({ request }) => {
        searches.push(new URL(request.url).searchParams.get('search'));

        return HttpResponse.json({ shelters: [{ id: 3, name: 'HAFKÁČI' }] });
      }),
    );

    renderWithProviders(<ShelterPicker value={null} onChange={() => {}} />);
    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'h' } });
    fireEvent.change(input, { target: { value: 'ha' } });
    fireEvent.change(input, { target: { value: 'haf' } });

    await waitFor(() => expect(searches).toContain('haf'));

    // The first request is the initial empty search; the keystrokes in between
    // must not each become one.
    expect(searches).toEqual([null, 'haf']);
  });

  it('hands back the chosen shelter with a numeric id', async () => {
    const onChange = vi.fn();
    renderWithProviders(<ShelterPicker value={null} onChange={onChange} />);

    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
    fireEvent.click(await screen.findByText('Trenčiansky Útulok'));

    expect(onChange).toHaveBeenCalledWith({ id: 2, name: 'Trenčiansky Útulok' });
  });

  it('shows the chosen shelter that came in as a prop', () => {
    renderWithProviders(<ShelterPicker value={{ id: 3, name: 'HAFKÁČI' }} onChange={() => {}} />);

    expect(screen.getByRole('combobox')).toHaveValue('HAFKÁČI');
  });

  // Deleting the text already cleared the field, but nothing said so. The row does.
  it('offers a way back to no shelter at all', async () => {
    const onChange = vi.fn();
    renderWithProviders(<ShelterPicker value={{ id: 3, name: 'HAFKÁČI' }} onChange={onChange} />);

    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
    fireEvent.click(await screen.findByText('Bez konkrétneho útulku'));

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('leaves it out while there is nothing to undo', async () => {
    renderWithProviders(<ShelterPicker value={null} onChange={() => {}} />);

    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });

    await screen.findByText('HAFKÁČI');
    expect(screen.queryByText('Bez konkrétneho útulku')).not.toBeInTheDocument();
  });

  // Empty is where a required field starts, so the way back to it is not a way to cheat: the
  // step still refuses to advance, which is a better answer than a choice that cannot be undone.
  it('offers it even where a shelter has to be chosen', async () => {
    renderWithProviders(
      <ShelterPicker value={{ id: 3, name: 'HAFKÁČI' }} onChange={() => {}} optional={false} />,
    );

    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });

    expect(await screen.findByText('Bez konkrétneho útulku')).toBeInTheDocument();
  });

  // A filtered list is a set of results; a row that clears the field is not one of them.
  it('keeps it out of search results', async () => {
    renderWithProviders(
      <ShelterPicker value={{ id: 2, name: 'Trenčiansky Útulok' }} onChange={() => {}} />,
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'haf' } });

    await screen.findByText('HAFKÁČI');
    expect(screen.queryByText('Bez konkrétneho útulku')).not.toBeInTheDocument();
  });

  // Arrow keys walk one list, so the row has to be part of it rather than beside it.
  it('is reachable with the keyboard', async () => {
    const onChange = vi.fn();
    renderWithProviders(<ShelterPicker value={{ id: 3, name: 'HAFKÁČI' }} onChange={onChange} />);

    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    await screen.findByText('Bez konkrétneho útulku');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('says so when nothing matches', async () => {
    server.use(http.get(sheltersUrl, () => HttpResponse.json({ shelters: [] })));

    renderWithProviders(<ShelterPicker value={null} onChange={() => {}} />);
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });

    expect(await screen.findByText('Žiadny útulok sa nenašiel')).toBeInTheDocument();
  });

  it('says so when the list cannot be loaded', async () => {
    server.use(http.get(sheltersUrl, () => new HttpResponse(null, { status: 500 })));

    renderWithProviders(<ShelterPicker value={null} onChange={() => {}} />);
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });

    expect(await screen.findByText('Útulky sa nepodarilo načítať')).toBeInTheDocument();
  });

  it('marks the control invalid when the form reports an error', () => {
    renderWithProviders(<ShelterPicker value={null} onChange={() => {}} error="Vyberte útulok" />);

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Vyberte útulok');
  });
});
