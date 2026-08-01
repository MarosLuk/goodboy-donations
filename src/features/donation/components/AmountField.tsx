'use client';

import styled from 'styled-components';
import { EuroIcon } from '@/components/icons/EuroIcon';

const MAX_DIGITS = 6;

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* The design keeps the euro a fifth of the box away from the digits. */
  gap: ${({ theme }) => theme.space[20]};
  /* The frame the design draws the rule under is 146 wide at a single digit. */
  min-width: 146px;
  padding-bottom: ${({ theme }) => theme.space[16]};
  border-bottom: ${({ theme }) =>
    `${theme.borderWidth.md} solid ${theme.color.action.primary.default}`};
`;

const Input = styled.input<{ $empty: boolean }>`
  /* Tabular figures make every digit the same width, which is what lets the ch unit
     below size the field exactly to its content. */
  font-variant-numeric: tabular-nums;
  font-size: ${({ theme }) => `var(--amount-size, ${theme.heading.xl.fontSize})`};
  /* The wrapper padding already holds the rule at the design's distance, so the digits
     carry no extra leading of their own. */
  line-height: 1;
  letter-spacing: ${({ theme }) => theme.heading.xl.letterSpacing};
  font-weight: ${({ theme }) => theme.font.weight.regular};
  text-align: right;
  border: none;
  background: none;
  padding: 0;
  /* Zero is the nothing-chosen state and the design greys it out. */
  color: ${({ theme, $empty }) =>
    $empty ? theme.color.content.quaternary : theme.color.content.primary};
  transition: color 150ms ease;

  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
`;

const Currency = styled(EuroIcon)`
  flex: none;
  color: ${({ theme }) => theme.color.content.tertiary};
`;

type AmountFieldProps = {
  value: number;
  onChange: (value: number) => void;
  id?: string;
  'aria-invalid'?: true;
  'aria-describedby'?: string;
};

export function AmountField({ value, onChange, ...rest }: AmountFieldProps) {
  const text = String(value);

  return (
    <Wrapper>
      <Input
        {...rest}
        // Not type="number": the spinner and the locale-dependent decimal handling
        // are both in the way of a field that only ever takes whole euros.
        type="text"
        inputMode="numeric"
        value={text}
        $empty={value === 0}
        style={{ width: `${text.length}ch` }}
        onChange={(event) => {
          const digits = event.target.value.replace(/\D/g, '').slice(0, MAX_DIGITS);

          onChange(digits === '' ? 0 : Number(digits));
        }}
      />
      <Currency />
    </Wrapper>
  );
}
