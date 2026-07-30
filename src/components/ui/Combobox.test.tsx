import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it } from 'vitest';
import { theme } from '@/styles/theme';
import type { ComboboxOption } from './Combobox';
import { Combobox } from './Combobox';

const options: ComboboxOption[] = [
  { value: '1', label: 'Žilinský útulok o.z.' },
  { value: '2', label: 'Trenčiansky Útulok' },
  { value: '3', label: 'HAFKÁČI' },
];

function Harness({ initialOptions = options }: { initialOptions?: ComboboxOption[] }) {
  const [value, setValue] = useState<ComboboxOption | null>(null);
  const [search, setSearch] = useState('');

  return (
    <ThemeProvider theme={theme}>
      <Combobox
        options={initialOptions}
        value={value}
        onValueChange={setValue}
        search={search}
        onSearchChange={setSearch}
        placeholder="Vyberte útulok zo zoznamu"
        emptyLabel="Nič sa nenašlo"
      />
    </ThemeProvider>
  );
}

function activeOptionText(input: HTMLElement) {
  const id = input.getAttribute('aria-activedescendant');

  return id ? document.getElementById(id)?.textContent : undefined;
}

describe('Combobox', () => {
  it('opens on ArrowDown with the first option active', () => {
    render(<Harness />);
    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-expanded', 'false');

    fireEvent.keyDown(input, { key: 'ArrowDown' });

    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(activeOptionText(input)).toBe('Žilinský útulok o.z.');
  });

  it('wraps around both ends of the list', () => {
    render(<Harness />);
    const input = screen.getByRole('combobox');

    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(activeOptionText(input)).toBe('HAFKÁČI');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(activeOptionText(input)).toBe('Žilinský útulok o.z.');
  });

  it('takes the active option on Enter and closes', () => {
    render(<Harness />);
    const input = screen.getByRole('combobox');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(input).toHaveValue('Trenčiansky Útulok');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('takes an option on click', () => {
    render(<Harness />);
    const input = screen.getByRole('combobox');

    fireEvent.click(input);
    fireEvent.click(screen.getByText('Trenčiansky Útulok'));

    expect(input).toHaveValue('Trenčiansky Útulok');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('still shows the chosen option after the list is reopened', () => {
    render(<Harness />);
    const input = screen.getByRole('combobox');

    fireEvent.click(input);
    fireEvent.click(screen.getByText('Žilinský útulok o.z.'));
    fireEvent.click(input);

    expect(input).toHaveValue('Žilinský útulok o.z.');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('closes on Escape without choosing', () => {
    render(<Harness />);
    const input = screen.getByRole('combobox');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveValue('');
  });

  it('drops the choice once the user types over it', () => {
    render(<Harness />);
    const input = screen.getByRole('combobox');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input).toHaveValue('Žilinský útulok o.z.');

    fireEvent.change(input, { target: { value: 'Tren' } });

    expect(input).toHaveValue('Tren');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('announces an empty result instead of listing options', () => {
    render(<Harness initialOptions={[]} />);
    const input = screen.getByRole('combobox');

    fireEvent.keyDown(input, { key: 'ArrowDown' });

    expect(screen.getByRole('status')).toHaveTextContent('Nič sa nenašlo');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
