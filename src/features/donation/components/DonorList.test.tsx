import { zodResolver } from '@hookform/resolvers/zod';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import type { StepTwoValues } from '../schema/donation';
import { emptyDonor, stepTwoSchema } from '../schema/donation';
import { DonorList } from './DonorList';

function Harness({ onValid = vi.fn() }: { onValid?: (values: StepTwoValues) => void }) {
  const form = useForm<StepTwoValues>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: { donors: [emptyDonor] },
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onValid)}>
        <DonorList />
        <button type="submit">Pokračovať</button>
      </form>
    </FormProvider>
  );
}

function addDonor() {
  fireEvent.click(screen.getByRole('button', { name: 'Pridať ďalšieho darcu' }));
}

function fillDonor(index: number, values: { first: string; last: string; email: string }) {
  fireEvent.change(screen.getAllByLabelText('Meno')[index], { target: { value: values.first } });
  fireEvent.change(screen.getAllByLabelText('Priezvisko')[index], {
    target: { value: values.last },
  });
  fireEvent.change(screen.getAllByLabelText('E-mail')[index], { target: { value: values.email } });
}

describe('DonorList', () => {
  it('starts with one donor and no numbering', () => {
    renderWithProviders(<Harness />);

    expect(screen.getAllByLabelText('Meno')).toHaveLength(1);
    expect(screen.queryByText('Darca 1')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Odstrániť/ })).not.toBeInTheDocument();
  });

  it('numbers the donors once there is more than one', () => {
    renderWithProviders(<Harness />);

    addDonor();

    expect(screen.getAllByLabelText('Meno')).toHaveLength(2);
    expect(screen.getByText('Darca 1')).toBeInTheDocument();
    expect(screen.getByText('Darca 2')).toBeInTheDocument();
  });

  it('says which donor a remove button belongs to', () => {
    renderWithProviders(<Harness />);

    addDonor();

    expect(screen.getByRole('button', { name: 'Odstrániť darcu 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Odstrániť darcu 2' })).toBeInTheDocument();
  });

  it('drops the numbering again once one donor is left', () => {
    renderWithProviders(<Harness />);

    addDonor();
    fireEvent.click(screen.getByRole('button', { name: 'Odstrániť darcu 2' }));

    expect(screen.getAllByLabelText('Meno')).toHaveLength(1);
    expect(screen.queryByText('Darca 1')).not.toBeInTheDocument();
  });

  it('keeps the right values when a donor in front is removed', () => {
    renderWithProviders(<Harness />);

    addDonor();
    fillDonor(0, { first: 'Prvý', last: 'Prvý', email: 'prvy@example.com' });
    fillDonor(1, { first: 'Druhý', last: 'Druhý', email: 'druhy@example.com' });

    fireEvent.click(screen.getByRole('button', { name: 'Odstrániť darcu 1' }));

    expect(screen.getByLabelText('Meno')).toHaveValue('Druhý');
    expect(screen.getByLabelText('E-mail')).toHaveValue('druhy@example.com');
  });

  it('validates every donor before letting the step through', async () => {
    const onValid = vi.fn();
    renderWithProviders(<Harness onValid={onValid} />);

    addDonor();
    fillDonor(0, { first: 'Maroš', last: 'Lukáč', email: 'maros@example.com' });
    fireEvent.click(screen.getByRole('button', { name: 'Pokračovať' }));

    await waitFor(() => expect(screen.getAllByRole('alert').length).toBeGreaterThan(0));
    expect(onValid).not.toHaveBeenCalled();

    fillDonor(1, { first: 'Janka', last: 'Lukáčová', email: 'janka@example.com' });
    fireEvent.click(screen.getByRole('button', { name: 'Pokračovať' }));

    await waitFor(() => expect(onValid).toHaveBeenCalledTimes(1));
    expect(onValid.mock.calls[0][0].donors).toHaveLength(2);
  });

  it('spells out that the amount covers the whole contribution', () => {
    renderWithProviders(<Harness />);

    expect(
      screen.getByText('Suma sa počíta raz za celý príspevok, nie za každého darcu.'),
    ).toBeInTheDocument();
  });
});
