'use client';

import styled from 'styled-components';

const MAX_DIGITS = 6;

const Wrapper = styled.div`
  display: inline-flex;
  align-items: baseline;
  justify-content: center;
  gap: ${({ theme }) => theme.space[8]};
  /* Wider than the digits so a single 0 does not sit on a stub of a line. */
  min-width: 144px;
  padding-bottom: ${({ theme }) => theme.space[8]};
  border-bottom: ${({ theme }) =>
    `${theme.borderWidth.md} solid ${theme.color.action.primary.default}`};
`;

const Input = styled.input<{ $empty: boolean }>`
  /* Tabular figures make every digit the same width, which is what lets the ch unit
     below size the field exactly to its content. */
  font-variant-numeric: tabular-nums;
  font-size: ${({ theme }) => `var(--amount-size, ${theme.heading.xxl.fontSize})`};
  /* The rule sits right under the digits in the design, so no extra leading. */
  line-height: 1;
  letter-spacing: ${({ theme }) => theme.heading.xxl.letterSpacing};
  font-weight: ${({ theme }) => theme.font.weight.regular};
  text-align: right;
  border: none;
  background: none;
  padding: 0;
  /* Zero is the nothing-chosen state and the design greys it out. */
  color: ${({ theme, $empty }) =>
    $empty ? theme.color.content.quaternary : theme.color.content.primary};

  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
`;

const Currency = styled.span`
  font-size: ${({ theme }) => theme.heading.sm.fontSize};
  line-height: ${({ theme }) => theme.heading.sm.lineHeight};
  color: ${({ theme }) => theme.color.content.primary};
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
      <Currency aria-hidden="true">€</Currency>
    </Wrapper>
  );
}
