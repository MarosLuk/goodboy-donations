import { zodResolver } from '@hookform/resolvers/zod';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import type { StepThreeValues } from '../schema/donation';
import { stepThreeSchema } from '../schema/donation';
import { ConsentField } from './ConsentField';

const LABEL = 'Súhlasím so spracovaním mojich osobných údajov';

function Harness({ onValid = vi.fn() }: { onValid?: (values: StepThreeValues) => void }) {
  const form = useForm<StepThreeValues>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: { consent: false },
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onValid)}>
        <ConsentField />
        <button type="submit">Darovať</button>
      </form>
    </FormProvider>
  );
}

function submit() {
  fireEvent.click(screen.getByRole('button', { name: 'Darovať' }));
}

describe('ConsentField', () => {
  it('starts unticked', () => {
    renderWithProviders(<Harness />);

    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('blocks the donation until it is ticked', async () => {
    const onValid = vi.fn();
    renderWithProviders(<Harness onValid={onValid} />);

    submit();

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('Bez súhlasu dar nemôžeme spracovať'),
    );
    expect(onValid).not.toHaveBeenCalled();
  });

  it('lets the donation through once it is ticked', async () => {
    const onValid = vi.fn();
    renderWithProviders(<Harness onValid={onValid} />);

    fireEvent.click(screen.getByRole('checkbox'));
    submit();

    await waitFor(() => expect(onValid).toHaveBeenCalledWith({ consent: true }, expect.anything()));
  });

  it('ties the message to the checkbox', async () => {
    renderWithProviders(<Harness />);

    submit();

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox.getAttribute('aria-describedby')).toBe(screen.getByRole('alert').id);
  });

  it('ticks when the wording next to it is clicked', () => {
    renderWithProviders(<Harness />);

    fireEvent.click(screen.getByText(LABEL));

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('clears the message after the box is ticked', async () => {
    renderWithProviders(<Harness />);

    submit();
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('checkbox'));

    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
  });
});
