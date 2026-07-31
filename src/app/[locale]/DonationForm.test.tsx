import { fireEvent, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { useWizard } from '@/features/donation/store/wizard';
import { contributeUrl } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderWithProviders } from '@/test/render';
import { DonationForm } from './DonationForm';

// The other suites drive the wizard with a stubbed shelter field. This one runs the real
// composition — both features wired together the way the page wires them — so the path
// from an empty form to the recorded payload is covered end to end.

function posted() {
  const bodies: unknown[] = [];

  server.use(
    http.post(contributeUrl, async ({ request }) => {
      bodies.push(await request.json());

      return HttpResponse.json({ messages: [{ type: 'SUCCESS', message: 'ok' }] });
    }),
  );

  return bodies;
}

const amountInput = () => screen.getByLabelText('Suma, ktorou chcem prispieť');
const continueButton = () => screen.getByRole('button', { name: /Pokračovať/ });

function fillDonor(index: number, email: string) {
  fireEvent.change(screen.getAllByLabelText('Meno')[index], { target: { value: 'Maroš' } });
  fireEvent.change(screen.getAllByLabelText('Priezvisko')[index], {
    target: { value: 'Lukáč' },
  });
  fireEvent.change(screen.getAllByLabelText('E-mail')[index], { target: { value: email } });
}

async function confirmAndDonate() {
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Darovať' }));
}

describe('the donation flow', () => {
  beforeEach(() => {
    useWizard.getState().reset();
    window.history.replaceState(null, '', '/sk');
  });

  it('carries a gift to the foundation from an empty form to a recorded payload', async () => {
    const bodies = posted();
    renderWithProviders(<DonationForm initialStep={1} />);

    fireEvent.click(screen.getByRole('button', { name: /^50\s*€$/ }));
    fireEvent.click(continueButton());

    await waitFor(() => expect(useWizard.getState().step).toBe(2));
    fillDonor(0, 'maros@example.com');
    fireEvent.change(screen.getByLabelText(/Telefón/), { target: { value: '900000000' } });
    fireEvent.click(continueButton());

    await waitFor(() => expect(useWizard.getState().step).toBe(3));
    await confirmAndDonate();

    await waitFor(() => expect(bodies).toHaveLength(1));
    expect(bodies[0]).toEqual({
      contributors: [
        {
          firstName: 'Maroš',
          lastName: 'Lukáč',
          email: 'maros@example.com',
          phone: '+421900000000',
        },
      ],
      shelterID: null,
      value: 50,
    });

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ďakujeme za váš dar'),
    );
  });

  it('sends the id of a shelter searched for and picked in the real combobox', async () => {
    const bodies = posted();
    renderWithProviders(<DonationForm initialStep={1} />);

    fireEvent.click(screen.getByLabelText('Prispieť konkrétnemu útulku'));

    const combobox = screen.getByRole('combobox', { name: /Útulok/ });
    fireEvent.change(combobox, { target: { value: 'hafk' } });

    // Typing is debounced before it becomes a request, so the option arrives late.
    fireEvent.click(await screen.findByText('HAFKÁČI'));

    fireEvent.change(amountInput(), { target: { value: '30' } });
    fireEvent.click(continueButton());

    await waitFor(() => expect(useWizard.getState().step).toBe(2));
    fillDonor(0, 'maros@example.com');
    fireEvent.click(continueButton());

    await waitFor(() => expect(useWizard.getState().step).toBe(3));
    expect(screen.getByText('HAFKÁČI')).toBeInTheDocument();

    await confirmAndDonate();

    await waitFor(() => expect(bodies).toHaveLength(1));
    expect(bodies[0]).toMatchObject({ shelterID: 3, value: 30 });
    expect(await screen.findByRole('status')).toHaveTextContent('HAFKÁČI');
  });

  it('sends two donors under one amount', async () => {
    const bodies = posted();
    renderWithProviders(<DonationForm initialStep={1} />);

    fireEvent.change(amountInput(), { target: { value: '40' } });
    fireEvent.click(continueButton());

    await waitFor(() => expect(useWizard.getState().step).toBe(2));
    fillDonor(0, 'prvy@example.com');
    fireEvent.click(screen.getByRole('button', { name: 'Pridať ďalšieho darcu' }));

    await waitFor(() => expect(screen.getAllByLabelText('Meno')).toHaveLength(2));
    fillDonor(1, 'druhy@example.com');
    fireEvent.click(continueButton());

    await waitFor(() => expect(useWizard.getState().step).toBe(3));
    await confirmAndDonate();

    await waitFor(() => expect(bodies).toHaveLength(1));
    const body = bodies[0] as { contributors: unknown[]; value: number };
    expect(body.contributors).toHaveLength(2);
    expect(body.value).toBe(40);
  });

  it('does not send twice when the button is pressed twice', async () => {
    const bodies = posted();
    renderWithProviders(<DonationForm initialStep={1} />);

    fireEvent.change(amountInput(), { target: { value: '10' } });
    fireEvent.click(continueButton());

    await waitFor(() => expect(useWizard.getState().step).toBe(2));
    fillDonor(0, 'maros@example.com');
    fireEvent.click(continueButton());

    await waitFor(() => expect(useWizard.getState().step).toBe(3));
    fireEvent.click(screen.getByRole('checkbox'));

    const donate = screen.getByRole('button', { name: 'Darovať' });
    fireEvent.click(donate);
    fireEvent.click(donate);

    await waitFor(() => expect(useWizard.getState().sent).toBe(true));
    expect(bodies).toHaveLength(1);
  });
});
