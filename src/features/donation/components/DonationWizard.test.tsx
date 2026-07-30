import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { useWizard } from '../store/wizard';
import { DonationWizard } from './DonationWizard';

// A stub instead of the real picker: the wizard is what is under test, and the slot is
// exactly the seam that keeps the two features apart.
function renderWizard() {
  return renderWithProviders(
    <DonationWizard
      renderShelterField={({ value, onChange, optional, error }) => (
        <div>
          <button type="button" onClick={() => onChange({ id: 3, name: 'HAFKÁČI' })}>
            {optional ? 'útulok nepovinný' : 'útulok povinný'}
          </button>
          <span>{value ? value.name : 'žiadny útulok'}</span>
          {error ? <span role="alert">{error}</span> : null}
        </div>
      )}
    />,
  );
}

const amountInput = () => screen.getByLabelText('Suma, ktorou chcem prispieť');
const continueButton = () => screen.getByRole('button', { name: /Pokračovať/ });

function fillDonor() {
  fireEvent.change(screen.getByLabelText('Meno'), { target: { value: 'Maroš' } });
  fireEvent.change(screen.getByLabelText('Priezvisko'), { target: { value: 'Lukáč' } });
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'maros@example.com' } });
}

describe('DonationWizard', () => {
  beforeEach(() => {
    useWizard.getState().reset();
    window.history.replaceState(null, '', '/sk');
  });

  it('opens on the first step', () => {
    renderWizard();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Vyberte si možnosť, ako chcete pomôcť',
    );
    expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent('Výber útulku');
  });

  it('holds the first step until an amount is given', async () => {
    renderWizard();

    fireEvent.click(continueButton());

    await waitFor(() => expect(screen.getByText('Najmenšia suma je 1 €')).toBeInTheDocument());
    expect(useWizard.getState().step).toBe(1);
  });

  it('calls the shelter optional only while the foundation is the target', () => {
    renderWizard();

    expect(screen.getByRole('button', { name: 'útulok nepovinný' })).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Prispieť konkrétnemu útulku'));

    expect(screen.getByRole('button', { name: 'útulok povinný' })).toBeInTheDocument();
  });

  it('will not move on when one shelter is the point and none is named', async () => {
    renderWizard();

    fireEvent.click(screen.getByLabelText('Prispieť konkrétnemu útulku'));
    fireEvent.change(amountInput(), { target: { value: '20' } });
    fireEvent.click(continueButton());

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Vyberte útulok, ktorému chcete prispieť',
      ),
    );
    expect(useWizard.getState().step).toBe(1);
  });

  it('walks all three steps and shows what was entered', async () => {
    renderWizard();

    fireEvent.click(screen.getByRole('button', { name: /50/ }));
    fireEvent.click(continueButton());

    await waitFor(() => expect(useWizard.getState().step).toBe(2));
    fillDonor();
    fireEvent.click(continueButton());

    await waitFor(() => expect(useWizard.getState().step).toBe(3));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Skontrolujte a potvrďte dar',
    );
    expect(screen.getByText('Prispieť celej nadácii')).toBeInTheDocument();
    expect(screen.getByText('Celá nadácia')).toBeInTheDocument();
    expect(screen.getByText('Maroš Lukáč')).toBeInTheDocument();
    expect(screen.getByText('maros@example.com')).toBeInTheDocument();
  });

  it('writes the step into the address bar and leaves the first one out', async () => {
    renderWizard();

    expect(window.location.search).toBe('');

    fireEvent.change(amountInput(), { target: { value: '20' } });
    fireEvent.click(continueButton());

    await waitFor(() => expect(window.location.search).toBe('?step=2'));

    fireEvent.click(screen.getByRole('button', { name: /Späť/ }));

    await waitFor(() => expect(window.location.search).toBe(''));
  });

  it('lands a link to a later step on the first one', async () => {
    renderWithProviders(<DonationWizard initialStep={3} renderShelterField={() => null} />);

    await waitFor(() => expect(useWizard.getState().step).toBe(1));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Vyberte si možnosť, ako chcete pomôcť',
    );
  });

  it('brings the typed values back when stepping backwards', async () => {
    renderWizard();

    fireEvent.change(amountInput(), { target: { value: '35' } });
    fireEvent.click(continueButton());

    await waitFor(() => expect(useWizard.getState().step).toBe(2));
    fireEvent.click(screen.getByRole('button', { name: /Späť/ }));

    await waitFor(() => expect(useWizard.getState().step).toBe(1));
    expect(amountInput()).toHaveValue('35');
  });
});
