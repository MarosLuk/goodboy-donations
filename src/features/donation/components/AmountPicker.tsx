'use client';

import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
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
  padding: ${({ theme }) => `${theme.space[24]} 0`};
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

  return (
    <Wrapper>
      <Label htmlFor={id}>{t('donation.amount.label')}</Label>

      <Centered>
        <AmountField
          id={id}
          value={value}
          onChange={onChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />

        {error ? (
          <FieldError id={errorId} role="alert">
            {error}
          </FieldError>
        ) : null}
      </Centered>

      <AmountPresets value={value} onChange={onChange} />
    </Wrapper>
  );
}
