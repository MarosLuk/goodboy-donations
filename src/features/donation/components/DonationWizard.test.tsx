import { fireEvent, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { contributeUrl } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
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

async function walkToLastStep() {
  fireEvent.change(amountInput(), { target: { value: '20' } });
  fireEvent.click(continueButton());

  await waitFor(() => expect(useWizard.getState().step).toBe(2));
  fillDonor();
  fireEvent.change(screen.getByLabelText(/Telefón/), { target: { value: '900000000' } });
  fireEvent.click(continueButton());

  await waitFor(() => expect(useWizard.getState().step).toBe(3));
}

const donateButton = () => screen.getByRole('button', { name: 'Darovať' });

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

  // The complaint belongs to one of the two ways of helping. Left alone it sat under a field
  // that had just relabelled itself optional, saying two opposite things at once.
  it('drops the complaint about a shelter when the money goes to the foundation', async () => {
    renderWizard();

    fireEvent.click(screen.getByLabelText('Prispieť konkrétnemu útulku'));
    fireEvent.change(amountInput(), { target: { value: '20' } });
    fireEvent.click(continueButton());

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());

    fireEvent.click(screen.getByLabelText('Prispieť celej nadácii'));

    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
  });

  // Coming back is not the same as trying again: nothing has been submitted in this state, so
  // there is nothing to complain about yet.
  it('does not complain again just because the shelter option came back', async () => {
    renderWizard();

    fireEvent.click(screen.getByLabelText('Prispieť konkrétnemu útulku'));
    fireEvent.change(amountInput(), { target: { value: '20' } });
    fireEvent.click(continueButton());

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());

    fireEvent.click(screen.getByLabelText('Prispieť celej nadácii'));
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());

    fireEvent.click(screen.getByLabelText('Prispieť konkrétnemu útulku'));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
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

  it('sends what was filled in and confirms it', async () => {
    const bodies: unknown[] = [];

    server.use(
      http.post(contributeUrl, async ({ request }) => {
        bodies.push(await request.json());

        return HttpResponse.json({ messages: [{ type: 'SUCCESS', message: 'ok' }] });
      }),
    );

    renderWizard();
    await walkToLastStep();

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(donateButton());

    // findBy would resolve at once on the heading of the step still on screen, so this
    // waits for the heading to change rather than for one to exist.
    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ďakujeme za váš dar'),
    );
    expect(screen.getByRole('status')).toHaveTextContent('Dar 20 € sme zaznamenali');
    expect(bodies).toEqual([
      {
        contributors: [
          {
            firstName: 'Maroš',
            lastName: 'Lukáč',
            email: 'maros@example.com',
            phone: '+421900000000',
          },
        ],
        shelterID: null,
        value: 20,
      },
    ]);
  });

  it('will not send anything without the consent', async () => {
    const posts: unknown[] = [];

    server.use(
      http.post(contributeUrl, () => {
        posts.push(1);

        return HttpResponse.json({ messages: [] });
      }),
    );

    renderWizard();
    await walkToLastStep();
    fireEvent.click(donateButton());

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('Bez súhlasu dar nemôžeme spracovať'),
    );
    expect(posts).toEqual([]);
  });

  it('carries a rejected donor field back to the step that shows it', async () => {
    server.use(
      http.post(contributeUrl, () =>
        HttpResponse.json(
          {
            messages: [
              {
                type: 'ERROR',
                message: 'joi.body.contributors.0.email',
                path: 'body.contributors.0.email',
              },
            ],
          },
          { status: 400 },
        ),
      ),
    );

    renderWizard();
    await walkToLastStep();

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(donateButton());

    await waitFor(() => expect(useWizard.getState().step).toBe(2));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Server toto pole neprijal. Skontrolujte ho prosím.',
    );
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true');
  });

  it('says a shelter went missing in our words, not the server ones', async () => {
    server.use(
      http.post(contributeUrl, () =>
        HttpResponse.json(
          { messages: [{ type: 'ERROR', message: 'Útulok sa nenašiel' }] },
          { status: 404 },
        ),
      ),
    );

    renderWizard();
    await walkToLastStep();

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(donateButton());

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Vybraný útulok sa už nenašiel. Vyberte prosím iný.');
    expect(alert).not.toHaveTextContent('Útulok sa nenašiel');
    expect(useWizard.getState().step).toBe(3);
  });

  it('keeps the donation on the last step when the server breaks', async () => {
    server.use(http.post(contributeUrl, () => new HttpResponse(null, { status: 500 })));

    renderWizard();
    await walkToLastStep();

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(donateButton());

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Server teraz neodpovedá správne. Skúste to prosím za chvíľu.',
    );
    expect(useWizard.getState().sent).toBe(false);
  });

  it('tells the caller once the gift is recorded', async () => {
    const onDonated = vi.fn();

    renderWithProviders(<DonationWizard renderShelterField={() => null} onDonated={onDonated} />);

    await walkToLastStep();
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(donateButton());

    await waitFor(() => expect(onDonated).toHaveBeenCalledTimes(1));
  });

  it('says nothing to the caller when sending fails', async () => {
    const onDonated = vi.fn();
    server.use(http.post(contributeUrl, () => new HttpResponse(null, { status: 500 })));

    renderWithProviders(<DonationWizard renderShelterField={() => null} onDonated={onDonated} />);

    await walkToLastStep();
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(donateButton());

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(onDonated).not.toHaveBeenCalled();
  });

  it('names the shelter in the confirmation when the gift went to one', async () => {
    renderWizard();

    fireEvent.click(screen.getByLabelText('Prispieť konkrétnemu útulku'));
    fireEvent.click(screen.getByRole('button', { name: 'útulok povinný' }));
    fireEvent.change(amountInput(), { target: { value: '30' } });
    fireEvent.click(continueButton());

    await waitFor(() => expect(useWizard.getState().step).toBe(2));
    fillDonor();
    fireEvent.click(continueButton());

    await waitFor(() => expect(useWizard.getState().step).toBe(3));
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(donateButton());

    expect(await screen.findByRole('status')).toHaveTextContent('HAFKÁČI');
  });

  it('starts over on an empty form when asked to give again', async () => {
    renderWizard();

    await walkToLastStep();
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(donateButton());

    fireEvent.click(await screen.findByRole('button', { name: 'Darovať znova' }));

    expect(useWizard.getState().step).toBe(1);
    expect(useWizard.getState().sent).toBe(false);
    expect(amountInput()).toHaveValue('0');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Vyberte si možnosť, ako chcete pomôcť',
    );
  });
});
