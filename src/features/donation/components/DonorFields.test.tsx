import { zodResolver } from '@hookform/resolvers/zod';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import type { StepTwoValues } from '../schema/donation';
import { emptyDonor, stepTwoSchema } from '../schema/donation';
import { DonorFields } from './DonorFields';

function Harness({ onValid = vi.fn() }: { onValid?: (values: StepTwoValues) => void }) {
  const form = useForm<StepTwoValues>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: { donors: [emptyDonor] },
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onValid)}>
        <DonorFields index={0} />
        <button type="submit">Pokračovať</button>
      </form>
    </FormProvider>
  );
}

function submit() {
  fireEvent.click(screen.getByRole('button', { name: 'Pokračovať' }));
}

function fill(label: string | RegExp, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

describe('DonorFields', () => {
  it('asks for a name, a surname and an email', async () => {
    renderWithProviders(<Harness />);

    submit();

    await waitFor(() => expect(screen.getAllByRole('alert')).toHaveLength(3));
    expect(screen.getAllByRole('alert').map((alert) => alert.textContent)).toEqual([
      'Zadajte 2 až 20 znakov',
      'Zadajte 2 až 20 znakov',
      'Zadajte platný e-mail',
    ]);
  });

  it('lets the phone through when it is left alone', async () => {
    const onValid = vi.fn();
    renderWithProviders(<Harness onValid={onValid} />);

    fill('Meno', 'Maroš');
    fill('Priezvisko', 'Lukáč');
    fill('E-mail', 'maros@example.com');
    submit();

    await waitFor(() => expect(onValid).toHaveBeenCalledTimes(1));
    expect(onValid.mock.calls[0][0].donors[0]).toMatchObject({
      firstName: 'Maroš',
      lastName: 'Lukáč',
      email: 'maros@example.com',
      phonePrefix: '+421',
      phone: '',
    });
  });

  it('complains about a phone that is not nine digits', async () => {
    renderWithProviders(<Harness />);

    fill('Meno', 'Maroš');
    fill('Priezvisko', 'Lukáč');
    fill('E-mail', 'maros@example.com');
    fill(/Telefón/, '90000');
    submit();

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('Zadajte 9 číslic bez predvoľby'),
    );
  });

  it('offers both country codes and starts on the slovak one', () => {
    renderWithProviders(<Harness />);

    const prefix = screen.getByLabelText('Predvoľba');
    expect(prefix).toHaveValue('+421');
    expect(screen.getByRole('option', { name: /\+421/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /\+420/ })).toBeInTheDocument();
  });

  it('keeps the czech code once it is chosen', async () => {
    const onValid = vi.fn();
    renderWithProviders(<Harness onValid={onValid} />);

    fill('Meno', 'Maroš');
    fill('Priezvisko', 'Lukáč');
    fill('E-mail', 'maros@example.com');
    fireEvent.change(screen.getByLabelText('Predvoľba'), { target: { value: '+420' } });
    submit();

    await waitFor(() => expect(onValid).toHaveBeenCalledTimes(1));
    expect(onValid.mock.calls[0][0].donors[0].phonePrefix).toBe('+420');
  });

  it('points every message at its own input', async () => {
    renderWithProviders(<Harness />);

    submit();

    await waitFor(() => expect(screen.getAllByRole('alert')).toHaveLength(3));

    for (const label of ['Meno', 'Priezvisko', 'E-mail']) {
      const input = screen.getByLabelText(label);
      const describedBy = input.getAttribute('aria-describedby');

      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(describedBy).toBeTruthy();
      expect(document.getElementById(describedBy as string)).toHaveAttribute('role', 'alert');
    }
  });
});
