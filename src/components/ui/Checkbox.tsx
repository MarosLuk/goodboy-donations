'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useId } from 'react';
import styled from 'styled-components';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { FieldError } from './FieldError';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[6]};
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space[8]};
`;

// The native input stays, stretched invisibly over the box: keyboard, Space, the
// label association and assistive tech all keep working, and only the paint is ours.
const Input = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
`;

const Box = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 16px;
  height: 16px;
  margin-top: ${({ theme }) => theme.space[2]};
  border-radius: ${({ theme }) => theme.radius[4]};
  border: ${({ theme }) => `${theme.borderWidth.xs} solid ${theme.color.content.quaternary}`};
  background: ${({ theme }) => theme.color.surface.primary};
  color: ${({ theme }) => theme.color.action.primary.default};

  svg {
    opacity: 0;
    /* The icon sits over the input, and an invisible icon still swallows clicks:
       without this, clicking the middle of the box does nothing. */
    pointer-events: none;
  }

  /* State comes from the input rather than from a prop, so the paint cannot fall out
     of step with what the checkbox actually is. */
  &:has(input:checked) {
    border-color: ${({ theme }) => theme.color.action.primary.default};
    background: ${({ theme }) => theme.color.action.primary.bg};
  }

  &:has(input:checked) svg {
    opacity: 1;
  }

  &:has(input:focus-visible) {
    box-shadow: ${({ theme }) => theme.focusRing};
  }

  &:has(input[aria-invalid='true']) {
    border-color: ${({ theme }) => theme.color.state.error.fg};
  }

  &:has(input:disabled) {
    opacity: 0.5;
  }
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.text.sm.fontSize};
  line-height: ${({ theme }) => theme.text.sm.lineHeight};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.color.content.secondary};
  cursor: pointer;
`;

type CheckboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'> & {
  label: ReactNode;
  error?: string;
};

export function Checkbox({ label, error, id, ...props }: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <Wrapper>
      <Row>
        <Box>
          <Input
            {...props}
            id={inputId}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          />
          <CheckIcon />
        </Box>

        <Label htmlFor={inputId}>{label}</Label>
      </Row>

      {error ? (
        <FieldError id={errorId} role="alert">
          {error}
        </FieldError>
      ) : null}
    </Wrapper>
  );
}
