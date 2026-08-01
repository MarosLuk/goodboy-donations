'use client';

import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css, keyframes } from 'styled-components';
import { FieldError } from '@/components/ui/FieldError';
import { AmountField } from './AmountField';
import { AmountPresets } from './AmountPresets';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[16]};
`;

// A section heading in the design, and the input's label in the markup — the field
// has no visible label of its own, so this one has to be it.
const Label = styled.label`
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.color.content.primary};
`;

const Centered = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[8]};
  /* With the wrapper gap this lands the presets 40 under the rule, as the frame has. */
  padding: ${({ theme }) => `0 0 var(--amount-air, ${theme.space[24]})`};
`;

// A preset landing in the figure gives it a small pulse — typing does not, a pulse
// per keystroke would be noise.
const pulse = keyframes`
  0% {
    transform: scale(0.97);
  }

  60% {
    transform: scale(1.03);
  }

  100% {
    transform: scale(1);
  }
`;

const Pulse = styled.div<{ $live: boolean }>`
  ${({ $live }) =>
    $live &&
    css`
      animation: ${pulse} 250ms ease-out;
    `}
`;

type AmountPickerProps = {
  value: number;
  onChange: (value: number) => void;
  /** Already translated, like every other field: the step that owns the form translates. */
  error?: string;
};

export function AmountPicker({ value, onChange, error }: AmountPickerProps) {
  const { t } = useTranslation();
  const id = useId();
  const errorId = `${id}-error`;

  // Counts preset picks; as the key below it remounts the frame, which is what lets
  // the same animation play again on every pick.
  const [picks, setPicks] = useState(0);

  return (
    <Wrapper>
      <Label htmlFor={id}>{t('donation.amount.label')}</Label>

      <Centered>
        <Pulse key={picks} $live={picks > 0}>
          <AmountField
            id={id}
            value={value}
            onChange={onChange}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          />
        </Pulse>

        {error ? (
          <FieldError id={errorId} role="alert">
            {error}
          </FieldError>
        ) : null}
      </Centered>

      <AmountPresets
        value={value}
        onChange={(next) => {
          setPicks((count) => count + 1);
          onChange(next);
        }}
      />
    </Wrapper>
  );
}
