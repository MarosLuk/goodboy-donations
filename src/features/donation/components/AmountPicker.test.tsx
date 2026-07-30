import { useState } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { AmountPicker } from './AmountPicker';

function Harness({ initial = 0 }: { initial?: number }) {
  const [amount, setAmount] = useState(initial);

  return (
    <>
      <AmountPicker value={amount} onChange={setAmount} />
      <output>{amount}</output>
    </>
  );
}

function amountInput() {
  return screen.getByLabelText('Suma, ktorou chcem prispieť');
}

// Intl separates the number from the currency with a non-breaking space, and the
// name matcher does not normalise it away. A pattern also asserts which side the
// symbol lands on, which is the part that differs between locales.
function preset(pattern: RegExp) {
  return screen.getByRole('button', { name: pattern });
}

describe('AmountPicker', () => {
  it('labels the field with the heading the design shows', () => {
    renderWithProviders(<Harness />);

    expect(amountInput()).toHaveValue('0');
  });

  it('takes a preset and marks only that one as pressed', () => {
    renderWithProviders(<Harness />);

    fireEvent.click(preset(/^50\s*€$/));

    expect(amountInput()).toHaveValue('50');
    expect(preset(/^50\s*€$/)).toHaveAttribute('aria-pressed', 'true');
    expect(preset(/^20\s*€$/)).toHaveAttribute('aria-pressed', 'false');
  });

  it('leaves every preset unpressed for an amount of its own', () => {
    renderWithProviders(<Harness initial={50} />);

    fireEvent.change(amountInput(), { target: { value: '77' } });

    expect(
      screen
        .getAllByRole('button')
        .every((button) => button.getAttribute('aria-pressed') === 'false'),
    ).toBe(true);
  });

  it('keeps out everything that is not a digit', () => {
    renderWithProviders(<Harness />);

    fireEvent.change(amountInput(), { target: { value: '1a2,5 €' } });

    expect(amountInput()).toHaveValue('125');
  });

  it('reads an emptied field as zero rather than as nothing', () => {
    renderWithProviders(<Harness initial={20} />);

    fireEvent.change(amountInput(), { target: { value: '' } });

    expect(amountInput()).toHaveValue('0');
  });

  it('stops at six digits', () => {
    renderWithProviders(<Harness />);

    fireEvent.change(amountInput(), { target: { value: '123456789' } });

    expect(amountInput()).toHaveValue('123456');
  });

  it('ties a validation message to the field', () => {
    const onChange = vi.fn();
    renderWithProviders(
      <AmountPicker value={0} onChange={onChange} error="donation.errors.amountMin" />,
    );

    const input = screen.getByLabelText('Suma, ktorou chcem prispieť');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Najmenšia suma je 1 €');
    expect(input.getAttribute('aria-describedby')).toBe(screen.getByRole('alert').id);
  });

  it('writes the presets in the active locale', () => {
    renderWithProviders(<Harness />, { locale: 'en' });

    expect(preset(/^€5$/)).toBeInTheDocument();
  });
});
