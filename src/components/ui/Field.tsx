'use client';

import type { ReactNode } from 'react';
import { useId } from 'react';
import styled from 'styled-components';
import { FieldError } from './FieldError';

type FieldControlProps = {
  id: string;
  'aria-invalid'?: true;
  'aria-describedby'?: string;
};

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  children: (control: FieldControlProps) => ReactNode;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[6]};
`;

const Label = styled.label`
  display: flex;
  gap: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.text.sm.fontSize};
  line-height: ${({ theme }) => theme.text.sm.lineHeight};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.color.content.primary};
`;

const Hint = styled.span`
  font-weight: ${({ theme }) => theme.font.weight.regular};
  color: ${({ theme }) => theme.color.content.quaternary};
`;

// The control comes in as a render prop so the label, the error and the input are
// wired to the same generated id here, instead of every caller repeating it and
// eventually getting it wrong.
export function Field({ label, hint, error, children }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <Wrapper>
      <Label htmlFor={id}>
        {label}
        {hint ? <Hint>{hint}</Hint> : null}
      </Label>

      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? errorId : undefined,
      })}

      {error ? (
        <FieldError id={errorId} role="alert">
          {error}
        </FieldError>
      ) : null}
    </Wrapper>
  );
}
