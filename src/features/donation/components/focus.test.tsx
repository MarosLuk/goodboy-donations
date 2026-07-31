import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { useWizard } from '../store/wizard';
import { DonationWizard } from './DonationWizard';

function renderWizard() {
  return renderWithProviders(<DonationWizard renderShelterField={() => null} />);
}

const amountInput = () => screen.getByLabelText('Suma, ktorou chcem prispieť');
const continueButton = () => screen.getByRole('button', { name: /Pokračovať/ });

function fillDonor(index = 0) {
  fireEvent.change(screen.getAllByLabelText('Meno')[index], { target: { value: 'Maroš' } });
  fireEvent.change(screen.getAllByLabelText('Priezvisko')[index], { target: { value: 'Lukáč' } });
  fireEvent.change(screen.getAllByLabelText('E-mail')[index], {
    target: { value: `donor${index}@example.com` },
  });
}

describe('focus between steps', () => {
  beforeEach(() => {
    useWizard.getState().reset();
    window.history.replaceState(null, '', '/sk');
  });

  it('leaves focus alone when the page first opens', () => {
    renderWizard();

    expect(document.body).toHaveFocus();
  });

  it('moves focus to the heading of the step that arrives', async () => {
    renderWizard();

    fireEvent.change(amountInput(), { target: { value: '20' } });
    fireEvent.click(continueButton());

    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toHaveFocus());
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Potrebujeme od Vás zopár informácií',
    );
  });

  it('moves focus back to the heading when stepping backwards', async () => {
    renderWizard();

    fireEvent.change(amountInput(), { target: { value: '20' } });
    fireEvent.click(continueButton());
    await waitFor(() => expect(useWizard.getState().step).toBe(2));

    fireEvent.click(screen.getByRole('button', { name: /Späť/ }));

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Vyberte si možnosť, ako chcete pomôcť',
      ),
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveFocus();
  });

  it('follows a new donor down to the field that wants typing', async () => {
    renderWizard();

    fireEvent.change(amountInput(), { target: { value: '20' } });
    fireEvent.click(continueButton());
    await waitFor(() => expect(useWizard.getState().step).toBe(2));

    fireEvent.click(screen.getByRole('button', { name: 'Pridať ďalšieho darcu' }));

    await waitFor(() => expect(screen.getAllByLabelText('Meno')).toHaveLength(2));
    expect(screen.getAllByLabelText('Meno')[1]).toHaveFocus();
  });

  it('puts focus somewhere sensible after a donor is removed', async () => {
    renderWizard();

    fireEvent.change(amountInput(), { target: { value: '20' } });
    fireEvent.click(continueButton());
    await waitFor(() => expect(useWizard.getState().step).toBe(2));

    fireEvent.click(screen.getByRole('button', { name: 'Pridať ďalšieho darcu' }));
    await waitFor(() => expect(screen.getAllByLabelText('Meno')).toHaveLength(2));

    fireEvent.click(screen.getByRole('button', { name: 'Odstrániť darcu 2' }));

    await waitFor(() => expect(screen.getAllByLabelText('Meno')).toHaveLength(1));
    expect(screen.getByRole('button', { name: 'Pridať ďalšieho darcu' })).toHaveFocus();
  });

  it('moves focus to the confirmation once the gift is recorded', async () => {
    renderWizard();

    fireEvent.change(amountInput(), { target: { value: '20' } });
    fireEvent.click(continueButton());
    await waitFor(() => expect(useWizard.getState().step).toBe(2));

    fillDonor();
    fireEvent.click(continueButton());
    await waitFor(() => expect(useWizard.getState().step).toBe(3));

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Odoslať formulár' }));

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ďakujeme za váš dar'),
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveFocus();
  });
});
